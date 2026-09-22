/**
 * Extract YouTube video ID from various YouTube URL formats
 */
export function extractYoutubeId(url) {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Get content targeted to a specific page
 */
export async function getPageContent(section, page, adminService) {
  try {
    const content = await adminService.getContentByLocation(section, page);
    return content || [];
  } catch (error) {
    console.log("Error fetching page content:", error.message);
    return [];
  }
}
