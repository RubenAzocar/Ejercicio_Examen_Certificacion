WITH ventas_totales AS (SELECT product_id, SUM(unidades) AS total
                        FROM ventas
                        GROUP BY product_id)
SELECT * FROM ventas_totales WHERE total > 500;
