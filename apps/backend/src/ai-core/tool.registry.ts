import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ToolRegistry {
  private readonly logger = new Logger(ToolRegistry.name);

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
              query: { type: "string", description: "Food item or category to search for" }
            },
            required: ["query"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "checkAvailability",
          description: "Check if a table is available for a specific date, time, and party size.",
          parameters: {
            type: "object",
            properties: {
              date: { type: "string", description: "YYYY-MM-DD" },
              guests: { type: "number" }
            },
            required: ["date", "guests"]
          }
        }
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
                    quantity: { type: "number" }
                  }
                }
              },
              orderType: { type: "string", enum: ["DINE_IN", "DELIVERY", "PICKUP"] }
            },
            required: ["items", "orderType"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "transferToHuman",
          description: "Escalate the call to a human staff member.",
          parameters: {
            type: "object",
            properties: {
              reason: { type: "string" }
            },
            required: ["reason"]
          }
        }
      }
    ];
  }

  // Executes the actual backend logic mapped to the tool name
  async executeTool(tenantId: string, toolName: string, args: any) {
    this.logger.log(`Executing tool ${toolName} for tenant ${tenantId}`);
    
    // In a real implementation, this would inject MenuService, ReservationService, etc.
    switch(toolName) {
      case 'searchMenu':
        return { success: true, result: `Found Mock Burger for $12` };
      case 'checkAvailability':
        return { success: true, result: `Available slots: 18:00, 18:30` };
      case 'calculateOrder':
        return { success: true, result: { subtotal: 12, tax: 1.2, total: 13.2 } };
      case 'transferToHuman':
        return { success: true, result: `Escalation triggered. Initiating SIP transfer.` };
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }
}
