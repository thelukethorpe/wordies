package io.wordies.crossword.repository;

import static org.apache.logging.log4j.Level.ERROR;
import static org.apache.logging.log4j.Level.INFO;

import io.wordies.config.PropertiesConfig;
import io.wordies.util.CollectionUtils;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

@Repository
public class FileSystemCrosswordRepository extends InMemoryCrosswordRepository {

  private static final Logger LOGGER = LogManager.getLogger(FileSystemCrosswordRepository.class);
  private static final String WORD_LEAD_TOKEN = "word:";
  private static final String WORD_DELIMITER = ":";
  private static final String HINT_LEAD_TOKEN = "-";

  @Autowired
  public FileSystemCrosswordRepository(PropertiesConfig propertiesConfig) {
    this(Path.of(propertiesConfig.getCrosswordRepositoryPath()));
  }

  private FileSystemCrosswordRepository(Path path) {
    super(parseHintsPath(path));
  }

  private static Map<String, List<String>> parseHintsPath(Path path) {
    LOGGER.log(INFO, "Parsing hints path: {}", path);
    File file = path.toFile();
    if (file.isFile()) {
      return parseHintsFile(file);
    } else {
      try (Stream<Path> paths = Files.walk(path.toAbsolutePath())) {
        return paths
            .map(Path::toFile)
            .filter(File::isFile)
            .map(FileSystemCrosswordRepository::parseHintsFile)
            .map(Map::entrySet)
            .flatMap(Set::stream)
            .collect(
                Collectors.toMap(
                    Map.Entry::getKey,
                    Map.Entry::getValue,
                    (a, b) -> CollectionUtils.union(a, b).stream().toList()));
      } catch (IOException e) {
        LOGGER.log(ERROR, "IO error: {}", e.getMessage());
      }
    }
    return Collections.emptyMap();
  }

  private static Map<String, List<String>> parseHintsFile(File file) {
    LOGGER.log(INFO, "Parsing hints file: {}", file.getName());
    Map<String, List<String>> wordToHintsMap = new HashMap<>();
    try (BufferedReader bufferedReader = new BufferedReader(new FileReader(file))) {
      String rawLine;
      String word = null;
      List<String> hints = new LinkedList<>();
      while ((rawLine = bufferedReader.readLine()) != null) {
        rawLine = rawLine.strip();
        String line = rawLine.toLowerCase();
        if (line.startsWith(WORD_LEAD_TOKEN)) {
          wordToHintsMap.put(word, hints);
          word = line.replaceFirst(WORD_LEAD_TOKEN, "").replaceAll("[^a-z]", "");
          hints = new LinkedList<>();
        } else if (rawLine.startsWith(HINT_LEAD_TOKEN)) {
          String hint =
              rawLine.replaceFirst(HINT_LEAD_TOKEN, "").replaceAll("\"|(\\(.*\\))", "").strip();
          hint = StringUtils.capitalize(hint);
          if (!hint.endsWith(".") && !hint.endsWith("?")) {
            hint += ".";
          }
          hints.add(hint);
        } else if (line.contains(WORD_DELIMITER)) {
          wordToHintsMap.put(word, hints);
          word = line.split(WORD_DELIMITER)[0].replaceAll("[^a-z]", "");
          hints = new LinkedList<>();
        }
      }
      wordToHintsMap.put(word, hints);
    } catch (FileNotFoundException e) {
      LOGGER.log(ERROR, "File not found: {}", e.getMessage());
    } catch (IOException e) {
      LOGGER.log(ERROR, "IO error: {}", e.getMessage());
    }
    wordToHintsMap.remove(null);
    return wordToHintsMap;
  }
}
