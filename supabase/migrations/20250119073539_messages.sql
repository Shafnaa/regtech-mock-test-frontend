CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    collection_id UUID REFERENCES collections ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    response TEXT DEFAULT 'This is example responses.' NOT NULL,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Individuals can create their own messages." ON messages FOR
INSERT
    TO authenticated
WITH
    CHECK (
        (
            SELECT auth.uid ()
        ) = (
            SELECT user_id
            FROM collections
            WHERE
                id = collection_id
        )
    );

CREATE POLICY "Individuals can read their own messages." ON messages FOR
SELECT USING (
        (
            SELECT auth.uid ()
        ) = (
            SELECT user_id
            FROM collections
            WHERE
                id = collection_id
        )
    );

CREATE POLICY "Individuals can update their own messages." ON messages FOR DELETE TO authenticated USING (
    (
        SELECT auth.uid ()
    ) = (
        SELECT user_id
        FROM collections
        WHERE
            id = collection_id
    )
);