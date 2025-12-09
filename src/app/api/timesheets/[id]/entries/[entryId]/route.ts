import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]/route';
import { mockWeeklyTimesheets } from '@/lib/mock-data';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; entryId: string } }
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

    const entryIndex = timesheet.entries.findIndex(
      (e) => e.id === params.entryId
    );

    if (entryIndex === -1) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }

    // Update entry
    timesheet.entries[entryIndex] = {
      ...timesheet.entries[entryIndex],
      ...body,
    };

    // Update status based on total hours
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

    return NextResponse.json({
      entry: timesheet.entries[entryIndex],
      timesheet,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; entryId: string } }
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

    const entryIndex = timesheet.entries.findIndex(
      (e) => e.id === params.entryId
    );

    if (entryIndex === -1) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }

    timesheet.entries.splice(entryIndex, 1);

    // Update status based on total hours
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

    return NextResponse.json({ success: true, timesheet });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

