---
layout: post
title: "IOI 2016 Day 1 1번 Detecting Molecules [C++]"
categories:
  - IOI
tags:
  - 정렬
  - 그리디 알고리즘
---

# [Detecting Molecules](https://oj.uz/problem/view/IOI16_molecules)

재미있는 그리디 문제입니다.

개인적으로 Subtask 5 풀이에서 많은 걸 배웠습니다.

<!-- more -->

# 풀이

## Subtask 1

모든 $w_i$가 동일하므로 $w_i$를 하나씩 더해주면서 $l \leq cw_i \leq u$인 $1 \leq c \leq n$이 존재하는지 확인하면 됩니다.

시간 복잡도 $O(n)$에 해결할 수 있습니다.

<details markdown="1">
<summary>코드</summary>

```cpp
#include "molecules.h"
#include <numeric>
using namespace std;

#define all(v) (v).begin(), (v).end()

vector<int> find_subset(int l, int u, vector<int> w) {
    int n = w.size();

    int sum = 0;
    int i = 0;
    for (; i < n and sum < l; i++)
        sum += w[i];

    if (l <= sum and sum <= u) {
        vector<int> ret(i);
        iota(all(ret), 0);
        return ret;
    }

    return {};
}

```

</details>

## Subtask 2

모든 $w_i$는 서로 최대 $1$만큼 차이가 납니다. $w_i$중 작은 값을 $w$, 큰 값을 $w + 1$라 합시다.

이때 $w_i = w$를 만족하는 $i$의 개수를 $a$, $w_j = w + 1$을 만족하는 $j$의 개수를 $b$라 하겠습니다.

$l \leq xw + y(w + 1) \leq u$를 만족하는 $0 \leq x \leq a$와 $0 \leq y \leq b$가 존재하는지 검사하면 됩니다.

시간 복잡도 $O(n^2)$에 해결할 수 있습니다.

<details markdown="1">
<summary>코드</summary>

```cpp
#include "molecules.h"
#include <algorithm>
using namespace std;

#define all(v) (v).begin(), (v).end()

vector<int> find_subset(int l, int u, vector<int> w) {
    int n = w.size();

    int minw = *min_element(all(w));
    int a = 0, b = 0;

    for (int i = 0; i < n; i++) {
        if (w[i] == minw)
            a++;
        else
            b++;
    }

    for (int x = 0; x <= a; x++) {
        for (int y = 0; y <= b; y++) {
            int sum = x*minw + y*(minw + 1);
            if (l <= sum and sum <= u) {
                vector<int> ret;

                for (int i = 0; i < n and (x > 0 or y > 0); i++) {
                    if (x > 0 and w[i] == minw) {
                        x--;
                        ret.push_back(i);
                    } else if (y > 0 and w[i] == minw + 1) {
                        y--;
                        ret.push_back(i);
                    }
                }

                return ret;
            }
        }
    }

    return {};
}

```

</details>

## Subtask 3 & 4

$dp_{ij}$를 $0$부터 $i$까지의 분자들을 이용해서 합이 $j$가 되는 부분집합이 존재하는지로 정의하고 배낭 DP를 이용해서 해결할 수 있습니다.

시간 복잡도는 $O(nu)$입니다.

<details markdown="1">
<summary>코드</summary>

```cpp
#include "molecules.h"
using namespace std;

vector<int> find_subset(int l, int u, vector<int> w) {
    int n = w.size();

    vector<vector<bool>> dp(n, vector<bool>(u + 1));
    dp[0][0] = dp[0][w[0]] = true;

    for (int i = 1; i < n; i++) {
        for (int j = 0; j <= u; j++) {
            dp[i][j] = dp[i - 1][j];
            int k = j - w[i];
            if (k >= 0 and dp[i - 1][k])
                dp[i][j] = true;
        }
    }

    int j = l;
    for (; j <= u; j++) {
        if (dp[n - 1][j])
            break;
    }
    if (j > u)
        return {};

    vector<int> ret;
    for (int i = n - 1; i != 0; i--) {
        if (dp[i - 1][j])
            continue;
        j -= w[i];
        ret.push_back(i);
    }
    if (j != 0)
        ret.push_back(0);

    return ret;
}
```

</details>

## Subtask 5

배낭 DP 풀이를 bitset을 이용해서 최적화 해 봅시다.

dp 배열은 비트 연산(`<<`, `|`)를 이용해서 빠르게 구할 수 있습니다.

역추적은 새로 비트가 켜진 인덱스를 기록하는 방식으로 해결할 수 있습니다.

시간 복잡도는 대략 $O\left(\dfrac{nu}{64} + \dfrac{u^2}{64}\right)$입니다.

<details markdown="1">
<summary>코드</summary>

```cpp
#include "molecules.h"
#include <bitset>
using namespace std;

constexpr int MAX_U = 500001;

vector<int> find_subset(int l, int u, vector<int> w) {
    int n = w.size();

    bitset<MAX_U> dp;
    vector<int> from(MAX_U, -1);
    dp[0] = dp[w[0]] = true;
    from[w[0]] = 0;

    for (int i = 1; i < n; i++) {
        bitset<MAX_U> added = (dp << w[i]) & ~dp;

        int j = 0;
        while (added.any()) {
            j = added._Find_next(j);
            from[j] = i;
            added[j] = false;
        }

        dp |= dp << w[i];
    }

    int j = l;
    for (; j <= u; j++) {
        if (from[j] != -1)
            break;
    }
    if (j > u)
        return {};

    vector<int> ret;
    for (int i = from[j]; i >= 0; i = from[j]) {
        j -= w[i];
        ret.push_back(i);
    }

    return ret;
}
```

</details>

## Subtask 6

$u - l \geq w_{\max} - w_{\min}$을 이용해서 문제를 해결해 봅시다.

만약 $0$부터 $u - l$이하의 값을 계속해서 더한다면 항상 $l$과 $u$사이의 값을 한 번 거쳐야 합니다.

$l$보다 작았던 수가 $u$보다 커지려면 $u - l$보다 큰 값을 더해야 하기 떄문입니다.

---

먼저 $w_i$를 기준으로 오름차순 정렬합시다. $w_i \leq w_{i + 1}$이라고 가정하겠습니다.

$\displaystyle \sum\limits_{i = 1}^k w_i \leq l$와 $\displaystyle u \leq \sum\limits_{i = 1}^{k + 1} w_i$를 만족하는 $k$를 찾습니다.

만약 등호가 성립한다면 그것이 해이므로 등호가 성립하지 않는 경우만 생각합시다.

$\displaystyle \sum\limits_{i = 1}^k w_i$에 $w_1$을 빼고 $w_{k + 1}$을 더합시다.

$w_{k + 1} - w_1 \leq w_{\max} - w_{\min}$이므로 $\displaystyle \sum\limits_{i = 2}^{k + 1} w_i$는 구간 $[l, u]$에 속하거나 $l$보다 작아야 합니다.

다시 $w_2$를 빼고 $w_{k + 2}$를 더합시다. 이를 계속 반복하여 $\displaystyle \sum\limits_{i = n - k + 1}^n w_i$까지 검사합니다. 이중 구간 $[l, u]$에 속하는 것을 발견하면 그것이 해가 됩니다.

이 중에서 해가 존재하지 않으면 항상 다른 해가 존재하지 않습니다.

만약 $w_{\min} = w_1 \leq u - l$인 경우 $\displaystyle\sum\limits_{i = 1}^k w_i$와 $\displaystyle \sum\limits_{i = 2}^k w_i$가 $u - l$이하의 차이가 나고 $\displaystyle \sum\limits_{i = 2}^{k + 1} w_i$와 $\displaystyle \sum\limits_{i = 2}^{k + 1} w_i + w_1 = \displaystyle \sum\limits_{i = 1}^{k + 1} w_i$이 $u - l$이하의 차이가 납니다.

모두 $u - l$이하의 차이가 나므로 셋 중 하나는 무조건 해여야 합니다.

$\displaystyle \sum\limits_{i = 1}^k w_i < l$이고 $\displaystyle u < \sum\limits_{i = 1}^{k + 1} w_i$이므로 항상 $\displaystyle \sum\limits_{i = 2}^k w_i$가 해가 됩니다.

따라서 $\displaystyle \sum\limits_{i = n - k + 1}^n w_i$까지 해를 발견하지 못했다는 뜻은 $w_1$이 $u - l$보다 크다는 뜻이 됩니다.

따라서 $\displaystyle \sum\limits_{i = n - k + 1}^n w_i$가 $l$보다 작은 최댓값이 되고, 해가 존재하지 않습니다.

시간 복잡도 $O(n\log n)$에 해결할 수 있습니다.

<details markdown="1">
<summary>코드</summary>

```cpp
#include "molecules.h"
#include <algorithm>
using namespace std;

using ll = long long;

#define all(v) (v).begin(), (v).end()
#define by(x) [](const auto& a, const auto& b) { return a.x < b.x; }

struct Molecule {
    ll w;
    int idx;
};

vector<int> find_subset(int l, int u, vector<int> w) {
    int n = w.size();

    vector<Molecule> molecules(n);
    for (int i = 0; i < n; i++)
        molecules[i] = {w[i], i};

    sort(all(molecules), by(w));

    ll sum = 0;
    int hi = 0;
    while (hi < n and sum < l)
        sum += molecules[hi++].w;
    hi--;

    if (sum < l)
        return {};

    if (sum <= u) {
        vector<int> ret;
        for (int i = 0; i <= hi; i++)
            ret.push_back(molecules[i].idx);
        return ret;
    }

    sum -= molecules[0].w;
    int lo = 1;
    while (hi + 1 < n and sum < l)
        sum += molecules[++hi].w - molecules[lo++].w;

    if (l <= sum) {
        vector<int> ret;
        for (int i = lo; i <= hi; i++)
            ret.push_back(molecules[i].idx);
        return ret;
    }

    return {};
}
```

</details>
