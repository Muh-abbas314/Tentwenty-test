import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { mockWeeklyTimesheets } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '5');
console.log("status", status, "startDate", startDate, "endDate", endDate, "page", page, "limit", limit);
    let filteredTimesheets = [...mockWeeklyTimesheets];

    // Filter by status
    if (status && status !== 'ALL') {
      filteredTimesheets = filteredTimesheets.filter(
        (ts) => ts.status === status
      );
    }

    // Filter by date range
    if (startDate && endDate) {
      filteredTimesheets = filteredTimesheets.filter((ts) => {
        const tsStart = new Date(ts.startDate);
        const tsEnd = new Date(ts.endDate);
        const filterStart = new Date(startDate);
        const filterEnd = new Date(endDate);

        // Check if timesheet overlaps with date range
        return (
          (tsStart >= filterStart && tsStart <= filterEnd) ||
          (tsEnd >= filterStart && tsEnd <= filterEnd) ||
          (tsStart <= filterStart && tsEnd >= filterEnd)
        );
      });
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTimesheets = filteredTimesheets.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredTimesheets.length / limit);

    return NextResponse.json({
      timesheets: paginatedTimesheets,
      pagination: {
        page,
        limit,
        total: filteredTimesheets.length,
        totalPages,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

