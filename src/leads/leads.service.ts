import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Lead, LeadDocument } from './entities/lead.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
    private emailService: EmailService,
  ) { }

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    const createdLead = new this.leadModel({
      ...createLeadDto,
      date: createLeadDto.date || new Date(),
    });
    const savedLead = await createdLead.save();

    // Enviar notificación por email
    await this.emailService.sendNewLeadNotification(savedLead);

    return savedLead;
  }

  async findAll(): Promise<Lead[]> {
    return this.leadModel.find().exec();
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.leadModel.findById(id).exec();
    if (!lead) {
      throw new NotFoundException(`Lead #${id} not found`);
    }
    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    const updatedLead = await this.leadModel
      .findByIdAndUpdate(id, updateLeadDto, { new: true })
      .exec();
    if (!updatedLead) {
      throw new NotFoundException(`Lead #${id} not found`);
    }
    return updatedLead;
  }

  async remove(id: string): Promise<void> {
    const result = await this.leadModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Lead #${id} not found`);
    }
  }
}
