CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE DEFAULT auth.uid() NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT now()
);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Individuals can create their own collections." ON collections FOR
INSERT
    TO authenticated
WITH
    CHECK (
        (
            SELECT auth.uid()
        ) = user_id
    );

CREATE POLICY "Individuals can read their own collections." ON collections FOR
SELECT USING (
        (
            SELECT auth.uid()
        ) = user_id
    );

CREATE POLICY "Individuals can update their own collections." ON collections FOR DELETE TO authenticated USING (
    (
        SELECT auth.uid()
    ) = user_id
);