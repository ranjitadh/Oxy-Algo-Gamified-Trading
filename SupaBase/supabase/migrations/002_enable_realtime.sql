-- Enable Realtime for all required tables
-- Run this after creating the tables in 001_initial_schema.sql

ALTER PUBLICATION supabase_realtime ADD TABLE accounts;
ALTER PUBLICATION supabase_realtime ADD TABLE trades;
ALTER PUBLICATION supabase_realtime ADD TABLE signals;
ALTER PUBLICATION supabase_realtime ADD TABLE alerts;

-- Optional: Enable for screenshots if you want real-time screenshot updates
-- ALTER PUBLICATION supabase_realtime ADD TABLE screenshots;



