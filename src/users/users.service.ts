import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import { hash } from 'bcryptjs';
@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    const emailTaken = await this.prismaService.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (emailTaken) {
      throw new ConflictException('This email is already in use');
    }

    const hashedPassword = await hash(password, 12);
    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        categories: {
          createMany: {
            data: [
              //Income
              { name: 'Salary', icon: 'salary', type: 'INCOME' },
              { name: 'Freelance', icon: 'freelance', type: 'INCOME' },
              { name: 'Other', icon: 'other', type: 'INCOME' },
              //Expense
              { name: 'Home', icon: 'home', type: 'EXPENSE' },
              { name: 'Food', icon: 'food', type: 'EXPENSE' },
              { name: 'Education', icon: 'education', type: 'EXPENSE' },
              { name: 'Leisure', icon: 'fun', type: 'EXPENSE' },
              { name: 'Grocery', icon: 'grocery', type: 'EXPENSE' },
              { name: 'Clothes', icon: 'clothes', type: 'EXPENSE' },
              { name: 'Transport', icon: 'transport', type: 'EXPENSE' },
              { name: 'Trips', icon: 'travel', type: 'EXPENSE' },
              { name: 'Outro', icon: 'other', type: 'EXPENSE' },
            ],
          },
        },
      },
    });

    return {
      name: user.name,
      email: user.email,
    };
  }
}
