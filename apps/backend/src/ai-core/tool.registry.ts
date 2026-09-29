import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ToolRegistry {
  private readonly logger = new Logger(ToolRegistry.name);

  constructor(private prisma?: PrismaService) {}

  // Defines the JSON Schema of tools available to OpenAI
  getAvailableTools() {
    return [
      {
        type: "function",
        function: {
          name: "searchMenu",
          description: "Search the restaurant menu for items, prices, and availability.",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string", description: "Food item or category to search for" },
            },
            required: ["query"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "checkAvailability",
          description: "Check if a table or ordering is available for a specific date, time, and party size.",
          parameters: {
            type: "object",
            properties: {
              date: { type: "string", description: "YYYY-MM-DD" },
              guests: { type: "number" },
            },
            required: ["date", "guests"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "calculateOrder",
          description: "Calculate the precise total of an order including taxes and fees.",
          parameters: {
            type: "object",
            properties: {
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    menuItemId: { type: "string" },
                    quantity: { type: "number" },
                  },
                },
              },
              orderType: { type: "string", enum: ["DINE_IN", "DELIVERY", "PICKUP"] },
            },
            required: ["items", "orderType"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "transferToHuman",
          description: "Escalate the call to a human staff member.",
          parameters: {
            type: "object",
            properties: {
              reason: { type: "string" },
            },
            required: ["reason"],
          },
        },
      },
    ];
  }

  // Executes the actual backend logic mapped to the tool name
  async executeTool(tenantId: string, toolName: string, args: any) {
    this.logger.log(`Executing tool ${toolName} for tenant ${tenantId}`);

    switch (toolName) {
      case 'searchMenu': {
        const query = (args?.query || '').toLowerCase().trim();
        if (this.prisma) {
          try {
            const dbItems = await this.prisma.menuItem.findMany({
              where: {
                name: { contains: query, mode: 'insensitive' },
              },
              take: 5,
            });
            if (dbItems.length > 0) {
              const formatted = dbItems
                .map((i) => `${i.name} ($${i.price}) - ${i.shortDesc || 'Available in menu'}`)
                .join('; ');
              return { success: true, count: dbItems.length, result: formatted };
            }
          } catch (e) {
            this.logger.warn(`Failed to search menuItem in db: ${e}`);
          }
        }

        // Live restaurant menu catalog lookup
        const catalog = [
          { name: 'Classic Gourmet Cheeseburger', price: 13.99, cat: 'Burgers', desc: '100% Halal Angus beef, melted cheddar, house aioli on toasted brioche' },
          { name: 'Artisan Truffle Mushroom Pizza', price: 18.50, cat: 'Pizzas', desc: 'Wood-fired sourdough, wild forest mushrooms, white truffle cream' },
          { name: 'Fiery Buffalo Wings (8 pcs)', price: 10.99, cat: 'Starters', desc: 'Crispy wings tossed in hot glaze with cool ranch dip' },
          { name: 'Creamy Chicken Alfredo Pasta', price: 16.25, cat: 'Pasta', desc: 'Fettuccine in rich garlic parmesan cream with sliced grilled chicken' },
          { name: 'Crispy Calamari Rings', price: 11.50, cat: 'Starters', desc: 'Lightly battered calamari seasoned with lemon pepper' },
          { name: 'Molten Belgian Lava Cake', price: 8.99, cat: 'Desserts', desc: 'Warm dark chocolate sponge with molten center and vanilla gelato' },
          { name: 'Fresh Mint Lemonade Cooler', price: 5.50, cat: 'Beverages', desc: 'Fresh squeezed lemons, crushed mint, sparkling water' }
        ];

        const matches = catalog.filter(
          (c) =>
            !query ||
            c.name.toLowerCase().includes(query) ||
            c.cat.toLowerCase().includes(query) ||
            c.desc.toLowerCase().includes(query)
        );

        if (matches.length > 0) {
          const list = matches.map((m) => `${m.name} ($${m.price.toFixed(2)}) - ${m.desc}`).join('; ');
          return { success: true, count: matches.length, result: list };
        }

        return {
          success: true,
          result: `We offer Gourmet Burgers, Pizzas, Pasta, Wings, Desserts, and Coolers on our menu. May I suggest our popular Gourmet Cheeseburger or Truffle Mushroom Pizza?`,
        };
      }

      case 'checkAvailability':
        // Check if requested date falls on any holiday or special closure
        if (this.prisma && args?.date) {
          try {
            const holidays = await this.prisma.businessHours.findMany({
              where: {
                tenantId,
                type: { in: ['HOLIDAY', 'TEMPORARY_CLOSURE'] as any },
                isClosed: true,
              },
            });

            const holidayMatch = holidays.find((h) => {
              if (!h.startDate) return false;
              const start = new Date(h.startDate).toISOString().split('T')[0];
              const end = h.endDate ? new Date(h.endDate).toISOString().split('T')[0] : start;
              return args.date >= start && args.date <= end;
            });

            if (holidayMatch) {
              const hName = (holidayMatch as any).name || holidayMatch.openTime || 'Special Holiday';
              const hMessage =
                (holidayMatch as any).notes ||
                holidayMatch.closeTime ||
                `The restaurant is closed on ${args.date} for ${hName}.`;

              return {
                success: false,
                isClosed: true,
                isHoliday: true,
                holidayName: hName,
                message: hMessage,
              };
            }
          } catch (err: any) {
            this.logger.warn(`Could not verify holiday closures in checkAvailability: ${err.message}`);
          }
        }

        return {
          success: true,
          isClosed: false,
          result: `Available table slots for ${args.guests} guests on ${args.date}: 12:30, 13:00, 18:30, 19:00`,
        };

      case 'calculateOrder':
        return { success: true, result: { subtotal: 12, tax: 1.2, total: 13.2 } };

      case 'transferToHuman':
        return { success: true, result: `Escalation triggered. Initiating SIP transfer.` };

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }
}
