---
layout: post
title: "17th JOI Final Round 2번 Art Exhibition [C++]"
categories:
  - JOI
tags:
  - 누적 합
  - 스위핑
---

# [Art Exhibition](https://oj.uz/problem/view/JOI18_art)

문제를 한국어로 설명하면 다음과 같습니다.

크기가 $A_i$이고 가치가 $B_i$인 작품들이 $N$개 있습니다.

이때 가능한 모든 부분집합에 대해 $\sum B_i - (A_{\max} - A_{\min})$의 최댓값을 구하는 문제입니다.

$A_{\max}$와 $A_{\min}$은 각각 집합에서 $A_i$의 최댓값과 최솟값입니다.

<!-- more -->

# 풀이

## Subtask 1

$N$이 충분히 작으므로 모든 부분집합에 대해서 검사해 볼 수 있습니다.

시간 복잡도는 $O(N2^N)$입니다.

<details markdown="1">
<summary>코드</summary>

```cpp
#include <bits/stdc++.h>
using namespace std;

template <typename T>
bool minimize(T& target, T candidate) {
    return target > candidate ? (target = candidate, true) : false;
}
template <typename T>
bool maximize(T& target, T candidate) {
    return target < candidate ? (target = candidate, true) : false;
}

using ll = long long;

struct Art {
    ll size, value;
} arts[505050];

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int N;
    cin >> N;

    for (int i = 0; i < N; i++) {
        auto& [size, value] = arts[i];
        cin >> size >> value;
    }

    ll answer = 0;
    for (int bit = 1; bit < (1 << N); bit++) {
        ll sum = 0, minSize = LLONG_MAX, maxSize = 0;

        for (int i = 0; i < N; i++) {
            if (~bit & (1 << i))
                continue;

            sum += arts[i].value;
            minimize(minSize, arts[i].size);
            maximize(maxSize, arts[i].size);
        }

        maximize(answer, sum - (maxSize - minSize));
    }

    cout << answer;

    return 0;
}
```

</details>

## Subtask 2

$A_j = A_{\max}$, $A_i = A_{\min}$이 되도록 $i$와 $j$를 잡으면 $A_i \leq A_k \leq A_j$를 만족하는 $k$는 모두 포함하는 것이 이득입니다.

문제에서 주어지는 작품들을 모두 $A_i$를 기준으로 오름차순 정렬합시다.

이제 가능한 모든 쌍 $(i, j)$에 대해 $\sum_{k = i}^j B_k - (A_j - A_i)$를 구하면 답을 찾을 수 있습니다.

$\sum B_k$를 구하는 데 $O(N)$이 걸리므로 총 시간 복잡도는 $O(N^3)$입니다.

<details markdown="1">
<summary>코드</summary>

```cpp
#include <bits/stdc++.h>
using namespace std;

using ll = long long;

#define by(x) [](const auto& a, const auto& b) { return a.x < b.x; }

template <typename T>
bool maximize(T& target, T candidate) {
    return target < candidate ? (target = candidate, true) : false;
}

struct Art {
    ll size, value;
} arts[505050];

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int N;
    cin >> N;

    for (int i = 1; i <= N; i++) {
        auto& [size, value] = arts[i];
        cin >> size >> value;
    }

    sort(arts + 1, arts + N + 1, by(size));

    ll answer = 0;
    for (int i = 1; i <= N; i++) {
        for (int j = i; j <= N; j++) {
            ll sum = 0;
            for (int k = i; k <= j; k++)
                sum += arts[k].value;
            maximize(answer, sum - (arts[j].size - arts[i].size));
        }
    }

    cout << answer;

    return 0;
}
```

</details>

## Subtask 3

Subtask 2의 풀이에서 $\sum B_k$를 누적 합을 이용해서 $O(1)$에 구하면 $O(N^2)$에 해결할 수 있습니다.

<details markdown="1">
<summary>코드</summary>

```cpp
#include <bits/stdc++.h>
using namespace std;

using ll = long long;

#define by(x) [](const auto& a, const auto& b) { return a.x < b.x; }

template <typename T>
bool maximize(T& target, T candidate) {
    return target < candidate ? (target = candidate, true) : false;
}

struct Art {
    ll size, value;
} arts[505050];

ll valueSum[505050];

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int N;
    cin >> N;

    for (int i = 1; i <= N; i++) {
        auto& [size, value] = arts[i];
        cin >> size >> value;
    }

    sort(arts + 1, arts + N + 1, by(size));
    for (int i = 1; i <= N; i++)
        valueSum[i] = valueSum[i - 1] + arts[i].value;

    ll answer = 0;
    for (int i = 1; i <= N; i++) {
        for (int j = i; j <= N; j++) {
            ll sum = valueSum[j] - valueSum[i - 1];
            maximize(answer, sum - (arts[j].size - arts[i].size));
        }
    }

    cout << answer;

    return 0;
}
```

</details>

## Subtask 4

$1$부터 $i$까지 $B_i$의 합을 $S_i$라고 합시다.

Subtask 3에서의 답을 식으로 쓰면 $\max(S_j - S_{i - 1} - (A_j - A_i))$입니다.

식을 정리해서 $i$에 대한 부분과 $j$에 대한 부분으로 나누면
$\max((A_i - S_{i - 1}) + (S_j - A_j))$로 쓸 수 있습니다.

이제 $j$를 고정하면 식은 $\max(A_i - S_{i - 1}) + S_j - A_j$가 됩니다.

$j = 1$부터 $N$까지 $1$씩 증가시키며 답을 구해 봅시다. 이전에 구한 $\max(A_i - S_{i - 1})$는 $1$부터 $j$까지의 최댓값이므로 이를 재활용하면 $j + 1$까지의 최댓값을 $O(1)$에 구할 수 있습니다.

따라서 $O(N)$에 문제의 답을 얻을 수 있습니다.

<details markdown="1">
<summary>코드</summary>

```cpp
#include <bits/stdc++.h>
using namespace std;

using ll = long long;

#define by(x) [](const auto& a, const auto& b) { return a.x < b.x; }

template <typename T>
bool maximize(T& target, T candidate) {
    return target < candidate ? (target = candidate, true) : false;
}

struct Art {
    ll size, value;
} arts[505050];

ll valueSum[505050];

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int N;
    cin >> N;

    for (int i = 1; i <= N; i++) {
        auto& [size, value] = arts[i];
        cin >> size >> value;
    }

    sort(arts + 1, arts + N + 1, by(size));
    for (int i = 1; i <= N; i++)
        valueSum[i] = valueSum[i - 1] + arts[i].value;

    ll answer = 0;
    ll m = 0;
    for (int i = 1; i <= N; i++) {
        maximize(m, arts[i].size - valueSum[i - 1]);
        maximize(answer, m + valueSum[i] - arts[i].size);
    }

    cout << answer;

    return 0;
}
```

</details>
