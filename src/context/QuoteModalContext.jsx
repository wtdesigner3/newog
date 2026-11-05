"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import QuoteModal from "../components/public/QuoteModal";

const QuoteModalContext = createContext({
  isOpen: false,
  modalData: {},
  openQuoteModal: () => {},
  closeQuoteModal: () => {},
});

/**
 * QuoteModalProvider — Universal quote & enquiry modal controller for the OG Heavy Duty platform.
 * Supports programmatic hook usage (`useQuoteModal()`), CustomEvents (`open-quote-modal`),
 * and declarative DOM attributes (`data-open-quote` or `href="#quote"`).
 */
export function QuoteModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState({});

  const openQuoteModal = useCallback((data = {}) => {
    setModalData(data || {});
    setIsOpen(true);
  }, []);

  const closeQuoteModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Listen for window-level custom events & declarative HTML data attributes
  useEffect(() => {
    const handleCustomEvent = (event) => {
      openQuoteModal(event.detail || {});
    };

    const handleDocumentClick = (event) => {
      const trigger = event.target.closest("[data-open-quote], a[href='#quote']");
      if (trigger) {
        event.preventDefault();
        const data = {
          product: trigger.dataset.product || "",
          model: trigger.dataset.model || "",
          category: trigger.dataset.category || "",
          enquiryType: trigger.dataset.enquiryType || "Commercial / Project Quotation",
          source: trigger.dataset.source || "button_click",
        };
        openQuoteModal(data);
      }
    };

    window.addEventListener("open-quote-modal", handleCustomEvent);
    document.addEventListener("click", handleDocumentClick);

    return () => {
      window.removeEventListener("open-quote-modal", handleCustomEvent);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [openQuoteModal]);

  return (
    <QuoteModalContext.Provider
      value={{
        isOpen,
        modalData,
        openQuoteModal,
        closeQuoteModal,
      }}
    >
      {children}
      <QuoteModal isOpen={isOpen} onClose={closeQuoteModal} data={modalData} />
    </QuoteModalContext.Provider>
  );
}

export function useQuoteModal() {
  const context = useContext(QuoteModalContext);
  if (!context) {
    throw new Error("useQuoteModal must be used within a QuoteModalProvider");
  }
  return context;
}

