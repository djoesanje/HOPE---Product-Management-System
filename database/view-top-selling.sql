DROP VIEW IF EXISTS top_selling_products;

CREATE VIEW top_selling_products AS
SELECT
  sd.prodcode,
  p.description,
  p.unit,
  SUM(sd.quantity) AS totalqty
FROM salesdetail sd
JOIN product p ON sd.prodcode = p.prodcode
GROUP BY sd.prodcode, p.description, p.unit
ORDER BY totalqty DESC;

-- Grant SELECT to authenticated users.
-- REP_002 right is gated at the application layer (hasRight('REP_002')).
GRANT SELECT ON top_selling_products TO authenticated;
