---
layout: post
title: "useEffect를 이용한 hydration mismatch 해결"
description:
categories:
  - 웹
tags:
  - Nextjs
  - React
---

서버 컴포넌트 속에 클라이언트 컴포넌트가 있고, 해당 컴포넌트가 클라이언트에서만 알 수 있는 값을 사용할 때, 당연히 서버측과 클라이언트 측의 렌더링 결과가 다르므로 mismatch가 발생할 수 밖에 없습니다.

# 문제

사이트의 layout에 Navigation Bar를 만들어 로그인 버튼을 넣었습니다. 이 로그인 버튼의 href가 가리키는 url의 뒤에 ?redirect를 넣어서 현재 보고 있는 페이지로 돌아올 수 있게끔 구현하려고 했습니다.

로그인 여부에 따라 로그인/로그아웃/회원가입 버튼을 표시해야 하므로 Navigation Bar는 server 컴포넌트여야 합니다.
그래서 로그인 버튼을 클라이언트 컴포넌트로 분리한 뒤 usePathname과 useSearchParams hook을 이용해서 url을 가져왔습니다.

```tsx
"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

interface LoginLinkProps {
  className?: string
}

export default function LoginLink({ className }: LoginLinkProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const query = searchParams.toString()
  const fullPath = query ? `${pathname}?${query}` : pathname

  return (
    <Link href={`/login?redirect=${fullPath}`} className={className}>
      로그인
    </Link>
  )
}
```

서버에서는 usePathname의 결과를 알 수 없으므로 당연히 서버측 렌더링 결과와 클라이언트측 렌더링의 결과가 달라지게 됩니다.

따라서 useEffect와 useState를 사용하여 mount되기 전에는 redirect가 없는 컴포넌트를, mount되고 나서는 redirect가 있는 컴포넌트를 반환하는 식으로 문제를 해결했습니다.

```tsx
"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

import { useEffect, useState } from "react"

interface LoginLinkProps {
  className?: string
}

export default function LoginLink({ className }: LoginLinkProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <Link href="/login" className={className}>로그인</Link>

  const query = searchParams.toString()
  const fullPath = query ? `${pathname}?${query}` : pathname

  return (
    <Link href={`/login?redirect=${fullPath}`} className={className}>
      로그인
    </Link>
  )
}
```