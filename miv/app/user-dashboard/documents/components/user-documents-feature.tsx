"use client"

import { useUserDocuments } from "../hooks/use-user-documents"
import { UserDocumentsDesktop } from "./desktop/user-documents-desktop"
import { UserDocumentsMobile } from "./mobile/user-documents-mobile"

export function UserDocumentsFeature() {
  const controller = useUserDocuments()

  return (
    <>
      <div className="hidden lg:block">
        <UserDocumentsDesktop controller={controller} />
      </div>
      <div className="lg:hidden">
        <UserDocumentsMobile controller={controller} />
      </div>
    </>
  )
}
