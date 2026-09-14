"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Organization } from "@/types/organization";
import { apiClient } from "@/api/client";
import { ORGS } from "@/api/endpoints";
import { useAuth } from "./auth-provider";

interface OrganizationContextType {
  organizations: Organization[];
  currentOrganization: Organization | null;
  setCurrentOrganization: (org: Organization) => void;
  isLoading: boolean;
  error: string | null;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganizationState] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setCurrentOrganization = (org: Organization) => {
    setCurrentOrganizationState(org);
    localStorage.setItem("currentOrganizationId", org.id);
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchOrganizations() {
      if (!user) {
        setOrganizations([]);
        setCurrentOrganizationState(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const response = await apiClient.get<Organization[]>(ORGS);
        const orgs = response.data;
        
        if (isMounted) {
          setOrganizations(orgs);
          
          if (orgs.length > 0) {
            const savedOrgId = localStorage.getItem("currentOrganizationId");
            const savedOrg = orgs.find(o => o.id === savedOrgId);
            
            if (savedOrg) {
              setCurrentOrganizationState(savedOrg);
            } else {
              setCurrentOrganization(orgs[0]);
            }
          } else {
            setCurrentOrganizationState(null);
          }
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to fetch organizations");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchOrganizations();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        currentOrganization,
        setCurrentOrganization,
        isLoading,
        error
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error("useOrganization must be used within an OrganizationProvider");
  }
  return context;
}
