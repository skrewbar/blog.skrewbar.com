---
layout: post
title: 비트마스킹을 이용한 부분집합과 조합
categories:
  - 알고리즘
tags:
  - 비트마스킹
---

비트마스킹은 비트를 켜고 끄는 것으로 집합을 나타내는 테크닉을 의미합니다.  
이 글에서는 비트마스킹을 통해 부분집합과 조합을 쉽게 구하는 방법에 대해 알아보겠습니다.

---

# 문제

가끔 문제 중에서, 주어진 $N$개의 원소들의 집합의 부분집합을 구해야 하는 경우가 있습니다.
$N$이 상수라면 $N$중 반복문을 통해 해결할 수 있습니다.  
[불 끄기](https://www.acmicpc.net/problem/14939)와 같은 문제가 여기에 해당합니다.  
아래는 제 파이썬 풀이 코드 중 일부입니다.

```python
min_count = -1
for a in range(2):  # 1
    for b in range(2):  # 2
        for c in range(2):  # 3
            for d in range(2):  # 4
                for e in range(2):  # 5
                    for f in range(2):  # 6
                        for g in range(2):  # 7
                            for h in range(2):  # 8
                                for i in range(2):  # 9
                                    for j in range(2):  # 10
                                        press_count = 0
                                        press_list = [a, b, c, d, e, f, g, h, i, j]
```

저는 이 당시에 비트마스킹을 통해 부분집합을 표현하는 방법을 몰랐기 때문에, 10중반복문을 통해 1024가지의 경우를 커버했습니다.  
근데 $N$이 상수가 아니거나, 너무 큰 경우에는 이러한 방법을 쓰기 어렵습니다.

# 비트마스킹

비트마스킹을 통해 집합을 나타내는 방법을 알아봅시다.  
쉽게 생각하기 위해 집합의 원소를 어떤 배열에 담아두었다고 합시다.

해당 배열의 부분집합을 정수 $k$를 통해 나타내겠습니다.  
인덱스가 $i$인 원소에 대해 $i$번째 비트가 1이면 포함, 그렇지 않으면 포함하지 않는다는 뜻입니다. 따라서
`k & 1 << i`가 참인지 거짓인지로 집합에 포함되는지 확인할 수 있습니다.

```python
for k in range(1 << n):
    for i in range(n):
      if k & 1 << i:
        # do something
```

만약 집합의 원소의 개수에 제한이 있다면 반복문을 통해 $k$의 켜져있는 비트 개수를 세주면 됩니다.  
이러한 방법으로 아까의 코드를 다시 작성하면

```python
for k in range(1 << 10):
    press_count = 0
    press_list = [bool(k & 1 << i) for i in range(10)]
```

처럼 작성할 수 있습니다.

이때 부분집합의 원소의 개수를 특정한 수로 제한하면 조합을 구할 수 있습니다.

# 연습문제

[치킨 배달](https://www.acmicpc.net/problem/15686): <span class="gold">골드 V</span>  
[풀이]({% post_url /boj/2024-11-12-boj-15686 %})

위 문제는 보통 백트래킹으로 풀지만 비트마스킹으로도 풀 수 있습니다.
