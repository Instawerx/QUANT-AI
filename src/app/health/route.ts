import { NextRequest, NextResponse } from 'next/server';
import { log } from '@/lib/logger';
// import { customMetrics } from '@/lib/telemetry'; // Disabled for static export

export const dynamic = 'force-static';
export const revalidate = false;

export async function GET(request: NextRequest) {
  const start = Date.now();

  try {
    // Basic health check
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        database: 'healthy', // TODO: Add actual database health check
        memory: getMemoryUsage(),
        cpu: getCpuUsage(),
      },
    };

    // Record metrics
    // customMetrics.apiRequestCounter.add(1, {
    //   method: 'GET',
    //   endpoint: '/health',
    //   status: '200',
    // });

    const duration = Date.now() - start;
    // customMetrics.apiRequestDuration.record(duration, {
    //   method: 'GET',
    //   endpoint: '/health',
    // });

    // Log the health check
    log.apiRequest('GET', '/health', 200, duration);

    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    const duration = Date.now() - start;

    log.error('Health check failed', { error });

    // customMetrics.apiRequestCounter.add(1, {
    //   method: 'GET',
    //   endpoint: '/health',
    //   status: '500',
    // });

    // customMetrics.apiRequestDuration.record(duration, {
    //   method: 'GET',
    //   endpoint: '/health',
    // });

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function getMemoryUsage() {
  const memUsage = process.memoryUsage();
  return {
    rss: Math.round(memUsage.rss / 1024 / 1024), // MB
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
    external: Math.round(memUsage.external / 1024 / 1024), // MB
  };
}

function getCpuUsage() {
  // Note: This is a simplified CPU usage calculation
  // In production, you might want to use a more sophisticated approach
  const loadAverage = process.cpuUsage();
  return {
    user: loadAverage.user,
    system: loadAverage.system,
  };
}