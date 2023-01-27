import { Category, CourseTag } from "@prisma/client";

export class CreateCourseDto {
  name: string;
  description: string;
  price: number;
  authorId: string;
  tags: CourseTag[];
  category: Category;
}