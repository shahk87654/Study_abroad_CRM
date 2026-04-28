import { formatDistanceToNowStrict, format } from "date-fns";

export function formatDate(value: string | null) {
  if (!value) {
    return "Not set";
  }

  return format(new Date(value), "dd MMM yyyy");
}

export function formatRelative(value: string) {
  return formatDistanceToNowStrict(new Date(value), { addSuffix: true });
}

export function getStudentName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`.trim();
}
