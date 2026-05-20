import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

function loadDomain() {
  const source = readFileSync("src/lib/domain.ts", "utf8").replace(
    'import { t } from "@/lib/i18n";',
    'function t(language, key) { return key === "developed" ? "Developed" : "Not developed yet"; }'
  );
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  const sandbox = { exports: {}, Intl };
  vm.runInNewContext(compiled, sandbox);
  return sandbox.exports;
}

function property(phone = "+95 9 4200 11122") {
  return {
    id: "property-1",
    code: "MMR-001",
    listingType: "sale",
    propertyType: "condo",
    landTitleType: "none",
    developmentStatus: "developed",
    location: "Yankin, Yangon",
    price: "100",
    currency: "MMK",
    bedrooms: "2",
    bathrooms: "1",
    size: "1000 sqft",
    description: "Near main road",
    status: "available",
    visibility: "private",
    internalNotes: "Owner prefers weekday calls",
    owner: { name: "Daw May", phone, notes: "Call after 10 AM" },
    media: [],
    createdBy: "Admin",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  };
}

function member(role, id = "member-1") {
  return {
    id,
    name: "Aung",
    phone: "+95 9 111 222 333",
    role,
    status: "active",
    firebaseUid: "",
    notes: "",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  };
}

const domain = loadDomain();

test("maskPhone keeps only a safe tail", () => {
  assert.equal(domain.maskPhone("+95 9 4200 11122"), "+95 9 *** *** 122");
});

test("admin can reveal owner phone", () => {
  assert.equal(domain.canRevealOwnerPhone(member("admin"), property(), []), true);
});

test("viewer cannot reveal owner phone", () => {
  assert.equal(domain.canRevealOwnerPhone(member("viewer"), property(), []), false);
});

test("agent can reveal only assigned property", () => {
  const assignedShowing = { propertyId: "property-1", assignedTeamMemberId: "member-1" };
  assert.equal(domain.canRevealOwnerPhone(member("agent"), property(), [assignedShowing]), true);
  assert.equal(domain.canRevealOwnerPhone(member("agent"), property(), []), false);
});

test("property search text excludes owner phone", () => {
  assert.equal(domain.propertyMatchesSearch(property("+95 9 4200 11122"), "4200"), false);
  assert.equal(domain.propertyMatchesSearch(property(), "Daw May"), true);
});
