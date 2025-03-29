---
layout: post
title: "밀러-라빈 소수 판별법"
categories:
  - 알고리즘
tags:
  - 수학
---

어떤 자연수가 소수인지 확인하는 방법은 여러가지가 있습니다.  
그중 효율적인 밀러-라빈 소수 판별법에 대해 알아봅시다.

# 보조정리

밀러-라빈 소수 판별법에 대해 배우기 전 먼저 알아야 할 정리들입니다.  
합동식에 대한 지식이 없으면 이해가 어려울 수 있습니다.

## 페르마의 소정리

소수 $p$와 서로소인 자연수 $a$에 대해 $a^{p-1} \equiv 1\pmod p$가 성립합니다.

### 증명

$a$의 배수들 $a, 2a, 3a, 4a, ..., (p-1)a$에 대해 생각해봅시다.  
합동식의 정의에 따라 위 자연수들은 법 $p$에 대해 서로 합동이 아닙니다.  
따라서 $a \times 2a \times 3a \times ... \times (p-1)a \equiv (p-1)! \pmod p$입니다.  
정리하면 $(p-1)!a^{p-1} \equiv (p-1)! \pmod p$인데 $p$와 $(p-1)!$은 서로소이므로  
$a^{p-1} \equiv 1\pmod p$가 성립합니다.

## 보조정리

소수 $p$와 자연수 $x$에 대해 $x^2 \equiv 1 \pmod p$이면 $x \equiv -1 \pmod p$ 또는 $x \equiv 1 \pmod p$입니다.  
$x^2 \equiv 1 \pmod p$에서 $p|(x^2 - 1)$이므로 $p|(x-1)(x+1)$이고 따라서 성립합니다.

# 밀러-라빈 소수 판별법

$p$가 짝수가 아닌 소수라고 합시다. 그렇다면 $p-1$은 짝수이고, 자연수 $s$와 홀수 $d$에 대해 $p-1 = 2^sd$와 같이 나타낼 수 있습니다.  
이때 $p$와 서로소인 자연수 $a$에 대해 $a^{p-1} \equiv 1 \pmod 1$이므로 $a^{2^sd} \equiv 1 \pmod p$입니다.  
보조정리를 활용하기 위해 식을 변형하면 $(a^{2^{s-1}d})^2 \equiv 1 \pmod p$입니다.  
따라서 $a^{2^{s-1}d}$은 법 $m$에 대해 $1$ 또는 $-1$과 합동입니다. $1$과 합동인 경우 방금 이용한 방법으로 지수의 $2$를 하나씩 제거할 수 있습니다.

정리하면, $p$가 소수인 경우 아래 둘 중 하나를 만족합니다.

- $a^d \equiv 1 \pmod p$
- $a^{2^rd} \equiv -1 \pmod p$ for some $0 \leq r < s$

이때, 명제의 역을 만족시키면 $p$가 소수일 것이라 추측할 수 있습니다. 다만, 수가 충분히 작은 경우 몇 개의 $a$에 대해서만 성립을 확인하면 $p$가 소수임을 보장할 수 있습니다.

int 범위에서는 2, 7, 61에 대해서 성립하면 소수입니다.  
long long 범위에서는 37 이하의 모든 소수에 대해 성립하면 소수입니다.

이 알고리즘은 $O(k\log^3 N)$의 시간복잡도를 갖습니다. $k$는 테스트할 정수의 개수입니다.

###### Python 코드

```python
def is_prime(n: int) -> bool:
    def miller_rabin_test(n: int, a: int) -> bool:
        k = n - 1
        while True:
            res = pow(a, k, n)
            if k & 1:
                return res == 1 or res == n - 1
            if res == n - 1:
                return True
            k >>= 1

    if n == 1:
        return False

    for a in (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37):
        if n == a:
            return True
        if n % a == 0:
            return False
        if not miller_rabin_test(n, a):
            return False
    return True
```
