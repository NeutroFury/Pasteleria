import { useEffect, useState } from "react";

export default function Ofertas() {
	const [productos, setProductos] = useState([]);

	useEffect(() => {
		// Datos locales para la vista de Ofertas (visual, no funcional)
		const data = [
			{ codigo: "TC001", nombre: "Torta Cuadrada de Chocolate", precio: 45000, descripcion: "Deliciosa torta de chocolate con ganache.", img: "img/Pastel_1.png", oferta: true, descuento: 15 },
			{ codigo: "TT001", nombre: "Torta Circular de Vainilla", precio: 40000, descripcion: "Bizcocho de vainilla clásico.", img: "img/Pastel_3.png", oferta: false },
			{ codigo: "PI002", nombre: "Tiramisú Clásico", precio: 5500, descripcion: "Postre italiano con mascarpone.", img: "img/Pastel_6.png", oferta: true, descuento: 20 },
			{ codigo: "PSA002", nombre: "Cheesecake Sin Azúcar", precio: 47000, descripcion: "Suave y cremoso.", img: "img/cheesecake.png", oferta: false },
			{ codigo: "PV001", nombre: "Torta Vegana de Chocolate", precio: 50000, descripcion: "Hecha sin ingredientes de origen animal.", img: "img/Pastel_12.png", oferta: true, descuento: 10 }
		];

		setProductos(data);
	}, []);

	const CLP = (n) =>
		n.toLocaleString("es-CL", {
			style: "currency",
			currency: "CLP",
			maximumFractionDigits: 0,
		});

	const productosEnOferta = productos.filter((p) => p.oferta);

	return (
		<main>
			<h1
				style={{
					textAlign: "center",
					margin: "1.5rem 0",
					color: "#7c3a2d",
					fontFamily: '"Pacifico", cursive',
				}}
			>
				Ofertas
			</h1>

			<p style={{ textAlign: "center", color: "#7c3a2d", marginTop: 0 }}>
				Aquí puedes ver los productos que actualmente tienen una oferta (vista visual).
			</p>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
					gap: "16px",
					padding: "1rem",
				}}
			>
				{productosEnOferta.length === 0 ? (
					<div style={{ gridColumn: "1/-1", textAlign: "center", color: "#7c3a2d" }}>
						No hay ofertas disponibles por el momento.
					</div>
				) : (
					productosEnOferta.map((p) => {
						const descuento = Number(p.descuento) || 0;
						const precioOferta = Math.round(p.precio * (1 - descuento / 100));

						return (
							<div
								key={p.codigo}
								style={{
									border: "1px solid #f0d9d2",
									borderRadius: "12px",
									boxShadow: "0 8px 20px rgba(0,0,0,.06)",
									display: "flex",
									flexDirection: "column",
									overflow: "hidden",
								}}
							>
								<div style={{ position: "relative" }}>
									<img
										src={p.img}
										alt={p.nombre}
										loading="lazy"
										style={{ width: "100%", height: "160px", objectFit: "cover" }}
									/>
									<span
										style={{
											position: "absolute",
											left: 10,
											top: 10,
											background: "#d9534f",
											color: "#fff",
											padding: "6px 8px",
											borderRadius: "8px",
											fontSize: "0.9rem",
										}}
									>
										Oferta {descuento}%
									</span>
								</div>

								<div style={{ padding: "10px 12px" }}>
									<h3 style={{ color: "#7c3a2d", margin: "0 0 6px" }}>{p.nombre}</h3>
									<p style={{ color: "#7c3a2d", opacity: ".9", marginBottom: "10px" }}>{p.descripcion}</p>

									<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
										<div>
											<div style={{ color: "#7c3a2d", fontWeight: "700" }}>{CLP(precioOferta)}</div>
											<div style={{ color: "#7c3a2d", opacity: ".7", textDecoration: "line-through", fontSize: "0.9rem" }}>
												{CLP(p.precio)}
											</div>
										</div>

										<button
											style={{
												background: "#d16a8a",
												color: "#fff",
												border: "none",
												borderRadius: "10px",
												padding: "8px 12px",
												cursor: "default",
												opacity: 0.95,
											}}
											title="Vista sólo visual"
										>
											Comprar
										</button>
									</div>
								</div>
							</div>
						);
					})
				)}
			</div>
		</main>
	);
}

