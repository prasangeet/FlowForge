/**
 * Format a date timestamp into a human-readable format
 * @param {number} timestamp - The timestamp in milliseconds
 * @returns {string} Formatted date string
 */
export const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    
    // Get today and tomorrow for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateDay = new Date(date);
    dateDay.setHours(0, 0, 0, 0);
    
    // For dates that are today or tomorrow, display special text
    if (dateDay.getTime() === today.getTime()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (dateDay.getTime() === tomorrow.getTime()) {
      return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // For dates within the next 7 days, display the day name
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    if (date < nextWeek) {
      const options = { 
        weekday: 'long', 
        hour: '2-digit', 
        minute: '2-digit'
      };
      return date.toLocaleDateString(undefined, options);
    }
    
    // For all other dates
    const options = { 
      day: 'numeric', 
      month: 'short', 
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      hour: '2-digit', 
      minute: '2-digit'
    };
    
    return date.toLocaleDateString(undefined, options);
  };
  
  /**
   * Check if a deadline is overdue
   * @param {Object} deadline - The deadline object
   * @returns {boolean} True if deadline is overdue
   */
  export const isDeadlineOverdue = (deadline) => {
    if (!deadline || !deadline.dueDate || !deadline.dueDate._seconds) {
      return false;
    }
    
    const dueDate = new Date(deadline.dueDate._seconds * 1000);
    const now = new Date();
    
    return deadline.status === "pending" && dueDate < now;
  };