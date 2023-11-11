package io.wordies.util.structure;

import io.wordies.util.Mutable;
import io.wordies.util.concurrent.Atomic;
import java.util.Collections;
import java.util.concurrent.PriorityBlockingQueue;
import java.util.concurrent.Semaphore;
import java.util.concurrent.atomic.AtomicBoolean;

public class BlockingConcurrentPercentileSampler<T> {
  private final Semaphore minCapacitySemaphore;
  private final Semaphore maxCapacitySemaphore;
  private final PriorityBlockingQueue<Node> priorityQueue;
  private final PriorityBlockingQueue<Node> reversePriorityQueue;
  private final Atomic<Double> excessFromLastSample;

  public BlockingConcurrentPercentileSampler(int minCapacity, int maxCapacity) {
    this.minCapacitySemaphore = new Semaphore(-minCapacity);
    this.maxCapacitySemaphore = new Semaphore(maxCapacity);
    this.priorityQueue = new PriorityBlockingQueue<>(maxCapacity);
    this.reversePriorityQueue =
        new PriorityBlockingQueue<>(maxCapacity, Collections.reverseOrder());
    this.excessFromLastSample = new Atomic<>(0.0);
  }

  public void offer(T value, double priority) throws InterruptedException {
    maxCapacitySemaphore.acquire();
    Node node = new Node(value, priority);
    priorityQueue.offer(node);
    reversePriorityQueue.offer(node);
    minCapacitySemaphore.release();
  }

  public T poll(double percentile) throws InterruptedException {
    minCapacitySemaphore.acquire();
    double realSampleSize = 1.0 / percentile;
    Mutable<Integer> discreteSampleSize = new Mutable<>();
    excessFromLastSample.update(
        excessFromLastSample -> {
          double realSampleSizeWithExcess = realSampleSize - excessFromLastSample;
          discreteSampleSize.setValue((int) Math.ceil(realSampleSizeWithExcess));
          return discreteSampleSize.getValue() - realSampleSizeWithExcess;
        });
    for (int i = 1; i < discreteSampleSize.getValue(); i++) {
      Node node = reversePriorityQueue.take();
      node.isStale.set(true);
    }
    Node result = priorityQueue.take();
    while (result.isStale.get()) {
      result = priorityQueue.take();
    }
    maxCapacitySemaphore.release(discreteSampleSize.getValue());
    return result.value;
  }

  private class Node implements Comparable<Node> {
    private final T value;
    private final double priority;
    private final AtomicBoolean isStale = new AtomicBoolean(false);

    private Node(T value, double priority) {
      this.value = value;
      this.priority = priority;
    }

    @Override
    public int compareTo(Node that) {
      // The largest priority comes first in the natural ordering.
      return Double.compare(that.priority, this.priority);
    }
  }
}
