// POST /auth/login/api
import { LoginFormSchema } from '@/app/lib/validations/LoginValidation';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = LoginFormSchema.parse(await req.json());
    console.log('email', email, 'password', password);
    return new NextResponse('It works');
  } catch (error) {
    const err = error as Error;
    console.error(err.message);
    return new NextResponse(err.message, { status: 400 });
  }
}
