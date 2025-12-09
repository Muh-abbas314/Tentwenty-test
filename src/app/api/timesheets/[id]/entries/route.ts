import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { mockWeeklyTimesheets, TimesheetEntry } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const timesheet = mockWeeklyTimesheets.find((ts) => ts.id === params.id);

    if (!timesheet) {
      return NextResponse.json(
        { error: 'Timesheet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ entries: timesheet.entries });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const timesheet = mockWeeklyTimesheets.find((ts) => ts.id === params.id);

    if (!timesheet) {
      return NextResponse.json(
        { error: 'Timesheet not found' },
        { status: 404 }
      );
    }

    const newEntry: TimesheetEntry = {
      id: `${params.id}-${Date.now()}`,
      date: body.date,
      project: body.project,
      typeOfWork: body.typeOfWork,
      taskDescription: body.taskDescription,
      hours: body.hours,
    };

    timesheet.entries.push(newEntry);

    const totalHours = timesheet.entries.reduce(
      (sum, entry) => sum + entry.hours,
      0
    );
    if (totalHours === 0) {
      timesheet.status = 'MISSING';
    } else if (totalHours < 40) {
      timesheet.status = 'INCOMPLETE';
    } else {
      timesheet.status = 'COMPLETED';
    }

    return NextResponse.json({ entry: newEntry, timesheet });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

