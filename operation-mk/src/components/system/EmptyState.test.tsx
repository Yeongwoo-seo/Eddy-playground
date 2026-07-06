import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders the default no-evidence copy", () => {
    render(<EmptyState />);
    expect(screen.getByText("NO EVIDENCE LOGGED")).toBeInTheDocument();
  });

  it("renders custom label and hint", () => {
    render(<EmptyState label="NO SUSPECTS LOGGED" hint="Keep digging." />);
    expect(screen.getByText("NO SUSPECTS LOGGED")).toBeInTheDocument();
    expect(screen.getByText("Keep digging.")).toBeInTheDocument();
  });
});
