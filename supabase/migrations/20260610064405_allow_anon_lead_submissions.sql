CREATE POLICY "insert_anon_leads" ON leads FOR INSERT
  TO anon WITH CHECK (user_id IS NULL);