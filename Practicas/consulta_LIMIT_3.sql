SELECT p.nombre, SUM(v.cantidad) as total_vendido
FROM productos p
INNER JOIN ventas v ON p.id = v.producto_id
GROUP BY p.id, p.nombre
ORDER BY total_vendido DESC
LIMIT 3;
