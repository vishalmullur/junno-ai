export interface AWSConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  s3BucketName: string;
  dynamoTablePrefix: string;
}

export const awsConfig: AWSConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  s3BucketName: process.env.AWS_S3_BUCKET_NAME || '',
  dynamoTablePrefix: process.env.AWS_DYNAMO_TABLE_PREFIX || '',
};
