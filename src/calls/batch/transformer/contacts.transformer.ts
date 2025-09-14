import { Injectable } from '@nestjs/common';
import { ContactInputDto } from '../dto/contact-input.dto';
import {
  CreateBatchCallDto,
  RecipientsDto,
} from '../../../external-apis/elevenlabs/dto/create-batch-call.dto';
import { StartBatchDto } from '../dto/start-batch.dto';

@Injectable()
export class ContactsTransformer {
  transformContactsToRecipients(batch: StartBatchDto): CreateBatchCallDto {
    const recipients = batch.contacts.map((contact) =>
      this._transformSingleContact(contact),
    );
    return {
      agent_id: batch.agent_id,
      call_name: batch.batch_name,
      agent_phone_number_id: batch.agent_phone_number_id,
      scheduled_time_unix: batch.schedule_at,
      recipients: recipients,
    };
  }

  private _transformSingleContact(contact: ContactInputDto): RecipientsDto {
    return {
      phone_number: contact.phone_number,
      conversation_initiation_client_data: {
        conversation_config_override: {
          agent: {
            first_message: `Hello {{full_name}}, this is a test message from our service.`,
          },
        },
        dynamic_variables: {
          full_name: contact.name || '',
        },
      },
    };
  }

  //   TODO add validation for the contact info like phone number validation,
}
