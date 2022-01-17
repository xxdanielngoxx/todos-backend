import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Todo extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
