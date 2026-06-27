"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { MainCategoryType } from "@repo/types";

const Categories = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [mainCategories, setMainCategories] = useState<MainCategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || "http://localhost:8000";
        const res = await fetch(`${baseUrl}/maincategory`);
        if (res.ok) {
          const data = await res.json();
          setMainCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const selected = searchParams.get("category");
  const mainCategorySlug = searchParams.get("mainCategory") || "dresses";

  const currentMainCategory = mainCategories.find(
    (mc) => mc.slug === mainCategorySlug
  ) || mainCategories[0];

  const categories = currentMainCategory?.categories || [];

  const handleChange = (slug: string) => {
    const params = new URLSearchParams(searchParams);

    if (selected === slug) {
      params.delete("category");
    } else {
      params.set("category", slug);
    }

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  if (loading) {
    return (
      <section style={{ padding: "3rem 1rem 2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="h-6 w-32 bg-gray-100 animate-pulse mx-auto rounded-md mb-2" />
          <div className="h-10 w-64 bg-gray-100 animate-pulse mx-auto rounded-md" />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-9 w-28 bg-gray-100 animate-pulse rounded-full" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      <section style={{ padding: "3rem 1rem 2.5rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                display: "block",
                height: 1,
                width: 28,
                background: "#c89b3c",
              }}
            />

            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#18320b",
                fontWeight: 600,
              }}
            >
              Collections
            </span>

            <span
              style={{
                display: "block",
                height: 1,
                width: 28,
                background: "#c89b3c",
              }}
            />
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 600,
              color: "#1a1a1a",
              lineHeight: 1,
              margin: 0,
            }}
          >
            Shop by{" "}
            <em style={{ fontStyle: "italic", color: "#7d1f1f" }}>Category</em>
          </h2>
        </div>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            maxWidth: 280,
            margin: "0 auto 1.75rem",
          }}
        >
          <span
            style={{
              flex: 1,
              height: "0.5px",
              background: "#c89b3c",
            }}
          />

          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c89b3c"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 17c0 0 2.5-10 7-10s7 10 7 10" />
            <line x1="12" y1="7" x2="12" y2="3" />
          </svg>

          <span
            style={{
              flex: 1,
              height: "0.5px",
              background: "#c89b3c",
            }}
          />
        </div>

        {/* Pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {categories.map((cat) => {
            const isActive = selected === cat.slug;

            return (
              <button
                key={cat.slug}
                onClick={() => handleChange(cat.slug)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 20px",
                  borderRadius: 100,
                  border: isActive ? "1px solid #18320b" : "1px solid #e3dac9",
                  background: isActive ? "#18320b" : "#ffffff",
                  color: isActive ? "#faf7f2" : "#18320b",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: "0.01em",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "#18320b";
                    e.currentTarget.style.background = "#faf7f2";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "#e3dac9";
                    e.currentTarget.style.background = "#ffffff";
                  }
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: isActive ? "#c89b3c" : "#18320b",
                    flexShrink: 0,
                  }}
                />

                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Active label */}
        {selected && (
          <p
            style={{
              textAlign: "center",
              marginTop: "1.25rem",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 15,
              fontStyle: "italic",
              color: "#18320b",
              letterSpacing: "0.05em",
              minHeight: 20,
            }}
          >
            Browsing — {categories.find((c) => c.slug === selected)?.name}
          </p>
        )}
      </section>
    </>
  );
};

export default Categories;
