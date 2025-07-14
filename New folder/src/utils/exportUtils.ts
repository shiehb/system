// src/utils/exportUtils.ts
export const exportToCsv = (data: any[], filename: string) => {
  // Define headers mapping
  const headers = {
    "ID Number": "id_number",
    Name: "name",
    Email: "email",
    "User Level": "user_level",
    Status: "status",
    "Created At": "created_at",
    "Updated At": "updated_at",
  };

  // Prepare header row
  const headerRow = Object.keys(headers).join(",");

  // Prepare data rows
  const dataRows = data
    .map((user) => {
      return [
        `"${user.id_number}"`,
        `"${user.first_name} ${user.last_name}"`,
        `"${user.email}"`,
        `"${user.user_level}"`,
        `"${user.status}"`,
        `"${new Date(user.created_at).toLocaleDateString()}"`,
        `"${new Date(user.updated_at).toLocaleDateString()}"`,
      ].join(",");
    })
    .join("\n");

  // Combine header and data
  const csvContent =
    "data:text/csv;charset=utf-8," + headerRow + "\n" + dataRows;

  // Create download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const prepareUserData = (users: any[]) => {
  return users.map((user) => ({
    id_number: user.id_number,
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    user_level: user.user_level,
    status: user.status,
    created_at: new Date(user.created_at).toLocaleDateString(),
    updated_at: new Date(user.updated_at).toLocaleDateString(),
  }));
};
