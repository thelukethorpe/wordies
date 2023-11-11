package io.wordies.component;

import io.wordies.config.PropertiesConfig;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ExecutorComponent {
  private final ExecutorService executorService;

  @Autowired
  public ExecutorComponent(PropertiesConfig propertiesConfig) {
    this.executorService = Executors.newFixedThreadPool(propertiesConfig.getExecutorThreads());
  }

  public void runOnLoop(Runnable runnable) {
    executorService.submit(new RecursiveRunnable(runnable));
  }

  private class RecursiveRunnable implements Runnable {

    private final Runnable runnable;

    private RecursiveRunnable(Runnable runnable) {
      this.runnable = runnable;
    }

    @Override
    public void run() {
      runnable.run();
      executorService.execute(this);
    }
  }
}
