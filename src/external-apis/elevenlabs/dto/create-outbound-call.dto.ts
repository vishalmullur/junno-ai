export class CreateOutboundCallDto {
  agent_id: string;
  agent_phone_number_id: string;
  to_number: string;
  conversation_initiation_client_data?: {
    conversation_config_override: {
      agent: {
        first_message: string;
      };
    };
  };
}
