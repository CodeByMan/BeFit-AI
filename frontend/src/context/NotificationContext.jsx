import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/Api";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);

  const fetchNotificationsCount = async () => {
    try {
      const res = await API.get("/workouts/notifications");

      if (res.data.success) {
        const {
          yesterday = [],
          today = [],
          tomorrow = [],
          future = [],
        } = res.data;

        const count =
          yesterday.length +
          today.length +
          tomorrow.length +
          future.length;

        setNotificationCount(count);
      }
    } catch (err) {
      console.error("Failed to fetch notification count:", err);
    }
  };

  useEffect(() => {
    fetchNotificationsCount();
    const interval = setInterval(fetchNotificationsCount, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{ notificationCount, fetchNotificationsCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
