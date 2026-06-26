import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProjectsModule } from '../projects/projects.module';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { ResearchNote, ResearchNoteSchema } from './schemas/research-note.schema';

@Module({
  imports: [
    ProjectsModule,
    MongooseModule.forFeature([{ name: ResearchNote.name, schema: ResearchNoteSchema }])
  ],
  controllers: [NotesController],
  providers: [NotesService]
})
export class NotesModule {}
