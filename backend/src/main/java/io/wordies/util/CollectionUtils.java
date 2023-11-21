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
}
