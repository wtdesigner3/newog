import { NextResponse } from 'next/server';

/**
 * Standardized API JSON response helpers for OG Heavy Duty Route Handlers
 */

export function successResponse(data = null, message = 'Success', status = 200, extra = {}) {
  return NextResponse.json(
    {
      success: true,
      message,
      ...(data !== null ? { data } : {}),
      ...extra,
    },
    { status }
  );
}

export function errorResponse(message = 'An error occurred', status = 500, errors = null) {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(errors ? { errors } : {}),
    },
    { status }
  );
}

export function unauthorizedResponse(message = 'Unauthorized: Please log in.') {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message = 'Forbidden: Insufficient permissions.') {
  return errorResponse(message, 403);
}

export function notFoundResponse(message = 'Resource not found.') {
  return errorResponse(message, 404);
}

export function validationErrorResponse(message = 'Validation failed', errors = null) {
  return errorResponse(message, 422, errors);
}

