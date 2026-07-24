import { NextResponse } from 'next/server';
import connectDB from 'src/lib/db';
import User from 'src/models/User';
import { hashPassword } from 'src/lib/auth';

export async function POST(request: Request) {
  try {
    const { setupKey, name, email, password } = await request.json();

    // 1. Validate the secret setup key
    const validKey = process.env.ADMIN_SETUP_KEY;
    if (!validKey || setupKey !== validKey) {
      return NextResponse.json(
        { error: 'Invalid setup key. Access denied.' },
        { status: 403 }
      );
    }

    // 2. Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are all required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    await connectDB();

    // 3. Check if an admin already exists with this email
    const existingAdmin = await User.findOne({ email: email.toLowerCase() });

    const hashedPassword = await hashPassword(password);

    if (existingAdmin) {
      // Update existing admin password
      existingAdmin.password = hashedPassword;
      existingAdmin.name = name;
      existingAdmin.role = 'admin';
      existingAdmin.status = 'active';
      await existingAdmin.save();

      return NextResponse.json({
        success: true,
        message: 'Admin password updated successfully. You can now log in.',
      });
    } else {
      // Create new admin account
      await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'admin',
        status: 'active',
      });

      return NextResponse.json({
        success: true,
        message: 'Admin account created successfully. You can now log in.',
      });
    }
  } catch (error: any) {
    console.error('Admin Setup Error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
