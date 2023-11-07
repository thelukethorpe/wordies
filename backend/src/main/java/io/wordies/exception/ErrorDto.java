package io.wordies.exception;

import java.util.List;

public record ErrorDto(List<String> errors) {}
