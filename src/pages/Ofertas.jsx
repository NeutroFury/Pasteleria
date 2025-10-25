import { useEffect, useMemo, useState } from "react";
import productService from "../data/productService";

export default function Ofertas() {
		const resolveImg = (src) => {
			if (!src) return '';
			if (/^https?:\/\//i.test(src) || /^data:/i.test(src)) return src;
			const s = String(src).replace(/^\/+/, '');
			const prefix = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
			return `${prefix}/${s}` || `/${s}`;
		};
	const [productos, setProductos] = useState([]);

	useEffect(() => {
			// Cargar desde servicio (localStorage con semilla del catálogo)
			setProductos(productService.getAll());
	}, []);

	const CLP = (n) =>
		Number(n).toLocaleString("es-CL", {
			style: "currency",
			currency: "CLP",
			maximumFractionDigits: 0,
		});

	const precioConDescuento = (p) => {
		const base = Number(p.precio) || 0;
		const d = Number(p.descuento) || 0;
		return d > 0 ? Math.round(base * (1 - d / 100)) : base;
	};

		const ofertas = useMemo(() => (productos || []).filter((p) => Number(p.descuento) > 0), [productos]);

	const agregarAlCarrito = (codigo) => {
		const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
		if (!isLoggedIn) {
			window.location.href = "/login";
			return;
		}

		const p = ofertas.find((x) => x.codigo === codigo);
		if (!p) return;

		let carrito = [];
		try {
			carrito = JSON.parse(localStorage.getItem("carrito")) || [];
		} catch {
			carrito = [];
		}
		if (!Array.isArray(carrito)) carrito = [];

		const existe = carrito.find((x) => x.codigo === codigo);
			if (existe) {
				if ((Number(existe.cantidad) || 1) >= 5) {
					alert("⚠️ No puedes agregar más de 5 unidades de este producto.");
					return;
				}
				// Asegurar precio vigente con descuento
				const pf = precioConDescuento(p);
				if (Number(existe.precio) !== pf) {
					existe.precio = pf;
				}
				existe.cantidad = (Number(existe.cantidad) || 1) + 1;
			} else {
			carrito.push({
				codigo: p.codigo,
				nombre: p.nombre,
				precio: precioConDescuento(p),
				img: p.img,
				categoria: p.categoria,
				cantidad: 1,
			});
		}

		localStorage.setItem("carrito", JSON.stringify(carrito));
		window.dispatchEvent(new Event("carrito-changed"));
	};

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
				Ofertas especiales
			</h1>

			{ofertas.length === 0 ? (
				<p style={{ textAlign: "center", color: "#7c3a2d" }}>
					No hay productos en oferta por ahora.
				</p>
			) : (
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
						gap: "16px",
						padding: "1rem",
					}}
				>
					{ofertas.map((p) => (
						<div
							key={p.codigo}
							className="card-sombra"
							style={{
								background: "#ffffff",
								borderRadius: "12px",
								display: "flex",
								flexDirection: "column",
								overflow: "hidden",
								position: "relative",
							}}
						>
							{/* Badge de oferta */}
							<div
								style={{
									position: "absolute",
									top: 8,
									left: 8,
									background: "#ff6b6b",
									color: "#fff",
									padding: "4px 8px",
									borderRadius: 8,
									fontWeight: 700,
									fontSize: 12,
								}}
							>
								-{p.descuento}%
							</div>

							<div className="catalog-thumb">
				    <img
					    src={resolveImg(p.img)}
									alt={p.nombre}
									loading="lazy"
								/>
							</div>
							<div style={{ padding: "10px 12px" }}>
								<h3 style={{ color: "#7c3a2d", margin: "0 0 6px" }}>{p.nombre}</h3>
								<p style={{ color: "#7c3a2d", opacity: ".9", marginBottom: "10px" }}>
									{p.descripcion}
								</p>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
									}}
								>
									<div style={{ display: "flex", flexDirection: "column" }}>
										<span style={{ textDecoration: "line-through", opacity: 0.6, color: "#7c3a2d" }}>
											{CLP(p.precio)}
										</span>
										<strong style={{ color: "#7c3a2d" }}>{CLP(precioConDescuento(p))}</strong>
									</div>
									<button
										onClick={() => agregarAlCarrito(p.codigo)}
										className="btn-agregar"
									>
										Agregar
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</main>
	);
}
