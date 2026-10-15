// Re-export the Twilio incoming handler so both /api/voice/twilio/incoming and /webhook/voice/twilio/incoming work
export { POST, GET } from "@/app/api/voice/twilio/incoming/route";
