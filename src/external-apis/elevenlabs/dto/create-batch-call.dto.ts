export class CreateBatchCallDto {
  agent_id: string;
  call_name: string;
  agent_phone_number_id: string;
  scheduled_time_unix: number;
  recipients: RecipientsDto[];
}

export interface RecipientsDto {
  phone_number: string;
  conversation_initiation_client_data: {
    conversation_config_override: {
      agent: {
        first_message: string;
      };
    };
    dynamic_variables: {
      full_name?: string;
    };
  };
}
