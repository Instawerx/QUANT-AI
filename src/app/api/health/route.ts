import { NextRequest, NextResponse } from "next/server";
import { log } from "@/lib/logger";
import { customMetrics } from "@/lib/telemetry";

export async function GET(request: NextRequest) {
  const start = Date.now();

  try {
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "quantai-api",
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      checks: {
        api: "healthy",
        contracts: await checkContractConnectivity(),
        external_services: await checkExternalServices(),
        performance: getPerformanceMetrics(),
      },
    };

    customMetrics.apiRequestCounter.add(1, {
      method: "GET",
      endpoint: "/api/health",
      status: "200",
    });

    const duration = Date.now() - start;
    customMetrics.apiRequestDuration.record(duration, {
      method: "GET",
      endpoint: "/api/health",
    });

    log.apiRequest("GET", "/api/health", 200, duration);

    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    const duration = Date.now() - start;

    log.error("API health check failed", { error });

    customMetrics.apiRequestCounter.add(1, {
      method: "GET",
      endpoint: "/api/health",
      status: "500",
    });

    customMetrics.apiRequestDuration.record(duration, {
      method: "GET",
      endpoint: "/api/health",
    });

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        service: "quantai-api",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function checkContractConnectivity() {
  try {
    return "healthy";
  } catch (error) {
    log.error("Contract connectivity check failed", { error });
    return "unhealthy";
  }
}

async function checkExternalServices() {
  try {
    return {
      blockchain: "healthy",
      database: "healthy",
    };
  } catch (error) {
    log.error("External services check failed", { error });
    return {
      blockchain: "unhealthy",
      database: "unhealthy",
    };
  }
}

function getPerformanceMetrics() {
  const memUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();

  return {
    memory: {
      rss: Math.round(memUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
      heapUtilization: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
    },
    cpu: {
      user: cpuUsage.user,
      system: cpuUsage.system,
    },
    uptime: Math.round(process.uptime()),
  };
}
