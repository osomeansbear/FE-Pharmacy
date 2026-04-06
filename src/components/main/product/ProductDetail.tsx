"use client";

import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { addCartItem } from "../../../../api/cart.api";
import { useAuthStore } from "../../../../stores/authStore";
import { ProductDetail as ProductDetailType } from "../../../../types/productTypes";

interface ProductDetailProps {
  product: ProductDetailType | null;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [quantity, setQuantity] = useState(1);
  const [selectedUnitType, setSelectedUnitType] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const units = product?.units ?? [];
  const stock = product?.stock ?? 0;
  const isOutOfStock = stock <= 0;
  const images =
    product?.image && product.image.length
      ? product.image
      : ["https://placehold.co/600x400?text=No+Image"];

  const selectedUnit = useMemo(() => {
    if (!units.length) return null;
    if (!selectedUnitType) {
      return units.find((unit) => unit.isDefault) ?? units[0];
    }

    return (
      units.find((unit) => unit.unitType === selectedUnitType) ??
      units.find((unit) => unit.isDefault) ??
      units[0]
    );
  }, [selectedUnitType, units]);

  useEffect(() => {
    if (!product) return;

    const initialUnit =
      product.units.find((unit) => unit.isDefault)?.unitType ??
      product.units[0]?.unitType ??
      null;

    setSelectedUnitType(initialUnit);
    setQuantity(1);
    setSelectedImage(0);
    setError("");
    setSuccessMessage("");
  }, [product]);

  if (!product) {
    return (
      <div className="rounded-lg bg-white p-8 text-sm text-slate-600">
        Product data is unavailable.
      </div>
    );
  }

  const onIncreaseQuantity = () => {
    setQuantity((prev) => {
      if (isOutOfStock) return 1;
      return Math.min(stock, prev + 1);
    });
  };

  const onDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleAddToCart = async (redirectToCart = false) => {
    setError("");
    setSuccessMessage("");

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isOutOfStock) {
      setError("This product is currently out of stock.");
      return;
    }

    if (!selectedUnit) {
      setError("No available unit for this product.");
      return;
    }

    try {
      setSubmitting(true);
      await addCartItem({
        productId: product.id,
        unitType: selectedUnit.unitType,
        quantity: String(quantity),
      });

      setSuccessMessage("Added to cart successfully.");

      if (redirectToCart) {
        router.push("/users/cart");
      }
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      setError(message || "Unable to add this product to cart.");
    } finally {
      setSubmitting(false);
    }
  };

  const detailRows = [
    { label: "Description", value: product.description },
    { label: "Ingredients", value: product.ingredients },
    { label: "Usage", value: product.usage },
    {
      label: "Composition",
      value: product.composition ? JSON.stringify(product.composition) : null,
    },
    { label: "Indications", value: product.indications },
    { label: "Dosage Form", value: product.dosageForm },
    { label: "Storage Condition", value: product.storageCondition },
    { label: "Packaging", value: product.packaging },
    { label: "Contraindications", value: product.contraindications },
    { label: "Interactions", value: product.interactions },
    { label: "Side Effects", value: product.sideEffects },
    { label: "Pharmacology", value: product.pharmacology },
    { label: "Pregnancy & Lactation", value: product.pregnancyLactation },
    { label: "Warnings", value: product.warnings },
  ].filter((row) => Boolean(row.value));

  return (
    <div className="space-y-6 p-4 md:p-8 lg:p-12">
      <div className="flex w-full flex-col gap-6 rounded-lg bg-white p-4 md:flex-row md:gap-8 md:p-6">
        <div className="flex w-full flex-col gap-3 md:w-1/2">
          <img
            src={images[selectedImage]}
            alt={product.name}
            className="h-72 w-full rounded-md bg-slate-50 object-contain md:h-96"
          />
          <div className="flex flex-wrap gap-2">
            {images.map((image, idx) => (
              <button
                key={`${image}-${idx}`}
                type="button"
                onClick={() => setSelectedImage(idx)}
                className={`overflow-hidden rounded-md border ${
                  selectedImage === idx ? "border-success" : "border-slate-200"
                }`}
                aria-label={`View product image ${idx + 1}`}
              >
                <img
                  src={image}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  className="h-14 w-14 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <h1 className="text-2xl font-semibold text-success md:text-3xl">
            {product.name}
          </h1>

          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <span>Code: #{product.id}</span>
            <span>Stock: {stock}</span>
            <span>
              {product.requiresRx
                ? "Prescription required"
                : "No prescription required"}
            </span>
          </div>

          <div className="rounded-lg bg-slate-100 p-4">
            <p className="text-sm text-slate-500">Price</p>
            <p className="text-2xl font-semibold text-emerald-700">
              {selectedUnit ? formatVND(selectedUnit.price) : "Unavailable"}
            </p>
            {selectedUnit && (
              <p className="text-sm text-slate-600">
                Unit: {selectedUnit.unitType}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-lg">Unit</span>
            <div className="flex flex-wrap gap-2">
              {units.length ? (
                units.map((unit) => (
                  <Button
                    key={unit.id}
                    type="button"
                    variant={
                      selectedUnit?.id === unit.id ? "default" : "outline"
                    }
                    className={
                      selectedUnit?.id === unit.id
                        ? "bg-success text-white"
                        : ""
                    }
                    onClick={() => setSelectedUnitType(unit.unitType)}
                  >
                    {unit.unitType}
                  </Button>
                ))
              ) : (
                <p className="text-sm text-red-600">
                  No unit options available.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-lg">Amount</span>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onDecreaseQuantity}
                aria-label="Decrease quantity"
                disabled={isOutOfStock}
              >
                -
              </Button>
              <span className="min-w-8 text-center">{quantity}</span>
              <Button
                type="button"
                variant="outline"
                onClick={onIncreaseQuantity}
                aria-label="Increase quantity"
                disabled={isOutOfStock || quantity >= stock}
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {product.requiresRx ? (
              <Button
                className="h-12 w-full justify-center rounded-lg border border-slate-300 bg-slate-100 text-base text-slate-500 md:w-auto cursor-not-allowed"
                disabled
              >
                Requires Prescription
              </Button>
            ) : (
              <>
                <Button
                  className="h-12 w-full justify-center rounded-lg border border-success bg-white text-base text-success md:w-56"
                  onClick={() => handleAddToCart(false)}
                  disabled={submitting || isOutOfStock || !selectedUnit}
                >
                  Add to cart
                </Button>
                <Button
                  className="h-12 w-full justify-center rounded-lg bg-success text-base text-white md:w-56"
                  onClick={() => handleAddToCart(true)}
                  disabled={submitting || isOutOfStock || !selectedUnit}
                >
                  Buy now
                </Button>
              </>
            )}
          </div>

          {isOutOfStock && (
            <p className="text-sm font-medium text-amber-700">
              This product is out of stock.
            </p>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
          {successMessage && (
            <p className="text-sm text-emerald-700">{successMessage}</p>
          )}

          <div className="rounded-lg border border-slate-200 p-4 text-sm text-slate-700">
            <p className="mb-2 text-base font-semibold text-slate-900">
              Product Overview
            </p>
            <p>Brand: {product.brand?.name || "Unknown"}</p>
            <p>Manufacturer: {product.manufacturer || "N/A"}</p>
            <p>Origin: {product.origin || "N/A"}</p>
            <p>Registration: {product.registrationNumber || "N/A"}</p>
            <p>Active Ingredients: {product.activeIngredients || "N/A"}</p>
            <p className="pt-2 text-slate-600">
              {product.shortDesc || "No short description available."}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-5 md:p-8">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">
          Product Details
        </h2>

        <div className="space-y-3 text-sm text-slate-700">
          {detailRows.length ? (
            detailRows.map((row) => (
              <div key={row.label}>
                <p className="font-medium text-slate-900">{row.label}</p>
                <p>{row.value}</p>
              </div>
            ))
          ) : (
            <p>No additional details available for this product.</p>
          )}
        </div>

        <p className="mt-6 text-xs text-slate-500">
          All information above is for reference only. Please read the product
          instructions carefully.
        </p>
      </div>
    </div>
  );
}
