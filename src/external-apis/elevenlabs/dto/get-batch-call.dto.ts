export class GetBatchCallDto {
  batch_id: string;
  org_id: string;
}

export class BatchCallResponseDto {
  batch_calls: BatchCallDatResponse[];
  next_doc: string;
  has_more: boolean;
}

export class BatchCallDatResponse {
  id: string;
  phone_number_id: string;
  name: string;
  created_at_unix: number;
  scheduled_time_unix: number;
  total_calls_dispatched: number;
  total_calls_scheduled: number;
  last_updated_at_unix: number;
  status: string;
}
