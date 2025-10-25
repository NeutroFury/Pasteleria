import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";

export default function Checkout() {
	const navigate = useNavigate();
	const [carrito, setCarrito] = useState([]);
	const [form, setForm] = useState({
		nombre: "",
		apellidos: "",
		correo: "",
		calle: "",
		depto: "",
		region: "",
		comuna: "",
		indicaciones: "",
	});
		const [errors, setErrors] = useState({});
		const [touched, setTouched] = useState({});

	useEffect(() => {
		try {
			const raw = localStorage.getItem("carrito");
			const arr = raw ? JSON.parse(raw) : [];
			setCarrito(Array.isArray(arr) ? arr : []);
		} catch {
			setCarrito([]);
		}
	}, []);

	const CLP = (n) =>
		Number(n).toLocaleString("es-CL", {
			style: "currency",
			currency: "CLP",
			maximumFractionDigits: 0,
		});

	const total = useMemo(
		() =>
			(Array.isArray(carrito) ? carrito : []).reduce(
				(sum, it) => sum + (Number(it.precio) || 0) * (Number(it.cantidad) || 1),
				0
			),
		[carrito]
	);

		const actualizar = (e) => {
		const { name, value } = e.target;
		setForm((f) => ({ ...f, [name]: value }));
			setErrors((prev) => ({ ...prev, [name]: undefined }));
	};

		const onBlur = (e) => {
			const { name } = e.target;
			setTouched((t) => ({ ...t, [name]: true }));
		};

		const validateFields = (vals) => {
			const err = {};
			const req = ["nombre", "apellidos", "correo", "calle", "region", "comuna"];
			req.forEach((k) => {
				if (!String(vals[k] || "").trim()) err[k] = "Campo obligatorio";
			});
			if (vals.correo && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(vals.correo)) {
				err.correo = "Correo inválido";
			}
			return err;
		};

	const validar = () => {
		if (!carrito || carrito.length === 0) {
			alert("Tu carrito está vacío.");
			navigate("/productos");
			return false;
		}
		const requeridos = ["nombre", "apellidos", "correo", "calle", "region", "comuna"];
		for (const k of requeridos) {
			if (!String(form[k] || "").trim()) {
				alert("Por favor completa los campos obligatorios.");
				return false;
			}
		}
		if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.correo)) {
			alert("Ingresa un correo válido.");
			return false;
		}
		return true;
	};

		const pagar = (e) => {
		e.preventDefault();
				const err = validateFields(form);

				// Armar objeto de orden con los datos actuales (éxito o fallo)
				const orden = {
				id: `ORD-${Date.now()}`,
				codigo: `ORDER${String(Date.now()).slice(-5)}`,
				nro: `#${new Date().getFullYear()}${String(Date.now()).slice(-4)}`,
				total,
				items: carrito,
				cliente: form,
				fecha: new Date().toISOString(),
			};
				localStorage.setItem("ultima_orden", JSON.stringify(orden));

				// Si faltan datos o el correo es inválido, ir a Pago-mal sin limpiar el carrito
				if (Object.keys(err).length > 0) {
					navigate("/pago-mal");
					return;
				}

				// Éxito: limpiar carrito y navegar a Pago-bien
				localStorage.setItem("carrito", JSON.stringify([]));
				window.dispatchEvent(new Event("carrito-changed"));
				navigate("/pago-bien");
	};

		return (
			<main>
				<div className="card cart-card" style={{ maxWidth: 900, margin: "20px auto" }}>
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<h2 className="estiloEncabezado" style={{ margin: 0 }}>Carrito de compra</h2>
					<span className="btn-principal" style={{ borderRadius: 8 }}>
						Total a pagar: {CLP(total)}
					</span>
				</div>
				<p style={{ color: "#7c3a2d", opacity: 0.8, marginTop: 6 }}>Completa la siguiente información</p>

				{/* Tabla de carrito */}
				<div className="cart-scroll" style={{ marginTop: 12 }}>
					<table className="cart-table" style={{ width: "100%" }}>
						<thead>
							<tr>
								<th>Imagen</th>
								<th>Nombre</th>
								<th>Precio</th>
								<th>Cantidad</th>
								<th>Subtotal</th>
							</tr>
						</thead>
						<tbody>
							{(carrito || []).map((it) => {
								const subtotal = (Number(it.precio) || 0) * (Number(it.cantidad) || 1);
								return (
									<tr key={it.codigo}>
										<td>
											<img className="thumb" src={it.img} alt={it.nombre} />
										</td>
										<td style={{ color: "#7c3a2d", fontWeight: 600 }}>{it.nombre}</td>
										<td>{CLP(it.precio)}</td>
										<td>{it.cantidad}</td>
										<td style={{ fontWeight: 700 }}>{CLP(subtotal)}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>

				{/* Formulario */}
				<form onSubmit={pagar} style={{ marginTop: 20 }}>
					<h3 className="estiloEncabezado" style={{ marginBottom: 6 }}>Información del cliente</h3>
					<p style={{ color: "#7c3a2d", opacity: 0.8 }}>Completa la siguiente información</p>

								<div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
									<div className="form-field">
										<label className="form-label">Nombre*</label>
										<input
											name="nombre"
											value={form.nombre}
											onChange={actualizar}
											onBlur={onBlur}
											className={`input${errors.nombre ? " is-invalid" : ""}`}
											placeholder="Nombre"
										/>
										{errors.nombre && <div className="form-error">{errors.nombre}</div>}
									</div>
									<div className="form-field">
										<label className="form-label">Apellidos*</label>
										<input
											name="apellidos"
											value={form.apellidos}
											onChange={actualizar}
											onBlur={onBlur}
											className={`input${errors.apellidos ? " is-invalid" : ""}`}
											placeholder="Apellidos"
										/>
										{errors.apellidos && <div className="form-error">{errors.apellidos}</div>}
									</div>
									<div className="form-field" style={{ gridColumn: "span 2" }}>
										<label className="form-label">Correo*</label>
										<input
											name="correo"
											type="email"
											value={form.correo}
											onChange={actualizar}
											onBlur={onBlur}
											className={`input${errors.correo ? " is-invalid" : ""}`}
											placeholder="correo@ejemplo.com"
										/>
										{errors.correo && <div className="form-error">{errors.correo}</div>}
									</div>
					</div>

					<h3 className="estiloEncabezado" style={{ margin: "16px 0 6px" }}>Dirección de entrega de los productos</h3>
					<p style={{ color: "#7c3a2d", opacity: 0.8 }}>Ingrese dirección de forma detallada</p>

								<div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
									<div className="form-field">
										<label className="form-label">Calle*</label>
										<input
											name="calle"
											value={form.calle}
											onChange={actualizar}
											onBlur={onBlur}
											className={`input${errors.calle ? " is-invalid" : ""}`}
											placeholder="Ej: Av. Siempre Viva 742"
										/>
										{errors.calle && <div className="form-error">{errors.calle}</div>}
									</div>
									<div className="form-field">
										<label className="form-label">Departamento (opcional)</label>
										<input name="depto" value={form.depto} onChange={actualizar} onBlur={onBlur} className="input" placeholder="Ej: 603" />
									</div>
					</div>

								<div className="form-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
									<div className="form-field">
										<label className="form-label">Región*</label>
										<select name="region" value={form.region} onChange={actualizar} onBlur={onBlur} className={`input${errors.region ? " is-invalid" : ""}`}>
								<option value="">Seleccione una región</option>
								<option>Región Metropolitana de Santiago</option>
								<option>Valparaíso</option>
								<option>Biobío</option>
								<option>Antofagasta</option>
								<option>Los Lagos</option>
							</select>
										{errors.region && <div className="form-error">{errors.region}</div>}
						</div>
									<div className="form-field">
										<label className="form-label">Comuna*</label>
										<select name="comuna" value={form.comuna} onChange={actualizar} onBlur={onBlur} className={`input${errors.comuna ? " is-invalid" : ""}`}>
								<option value="">Seleccione una comuna</option>
								<option>Cerrillos</option>
								<option>Maipú</option>
								<option>Providencia</option>
								<option>Santiago</option>
								<option>Las Condes</option>
							</select>
										{errors.comuna && <div className="form-error">{errors.comuna}</div>}
						</div>
					</div>

								<div className="form-field" style={{ marginTop: 12 }}>
									<label className="form-label">Indicaciones para la entrega (opcional)</label>
									<textarea name="indicaciones" value={form.indicaciones} onChange={actualizar} onBlur={onBlur} className="input" placeholder="Ej: Entre calles, color del edificio, no tiene timbre." rows={3} />
					</div>

					<div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
						<button type="submit" className="btn-compra">
							Pagar ahora {CLP(total)}
						</button>
					</div>
				</form>
			</div>
		</main>
	);
}
