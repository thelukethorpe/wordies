package io.wordies.util;

import java.util.*;

public class CollectionUtils {

  @SafeVarargs
  public static <T> Set<T> intersection(Collection<T> collection, Collection<T>... collections) {
    return intersection(collection, Arrays.asList(collections));
  }

  public static <T> Set<T> intersection(Collection<T> collection, List<Collection<T>> collections) {
    Set<T> intersection = new HashSet<>(collection);
    collections.forEach(intersection::retainAll);
    return intersection;
  }

  @SafeVarargs
  public static <T> Set<T> union(Collection<T>... collections) {
    return union(Arrays.asList(collections));
  }

  public static <T> Set<T> union(List<Collection<T>> collections) {
    Set<T> union = new HashSet<>();
    collections.forEach(union::addAll);
    return union;
  }

  public static <T extends Comparable<T>> List<T> sortN(Collection<T> collection, int n) {
    List<T> result = new ArrayList<>();
    if (n <= 0) {
      return result;
    }

    PriorityQueue<T> reversePriorityQueue = new PriorityQueue<>(Collections.reverseOrder());
    for (T value : collection) {
      if (reversePriorityQueue.size() < n) {
        reversePriorityQueue.offer(value);
        continue;
      }
      T top = reversePriorityQueue.peek();
      if (value.compareTo(top) < 0) {
        reversePriorityQueue.poll();
        reversePriorityQueue.offer(value);
      }
    }

    while (!reversePriorityQueue.isEmpty()) {
      result.add(reversePriorityQueue.poll());
    }
    Collections.reverse(result);
    return result;
  }
}
