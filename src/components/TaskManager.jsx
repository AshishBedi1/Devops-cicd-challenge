import { useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'taskboard.tasks.v1'

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (t) =>
        t &&
        typeof t.id === 'string' &&
        typeof t.title === 'string' &&
        typeof t.done === 'boolean'
    )
  } catch {
    return []
  }
}

function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    /* ignore quota */
  }
}

export default function TaskManager() {
  const [tasks, setTasks] = useState(loadTasks)
  const [draft, setDraft] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = useCallback(
    (e) => {
      e.preventDefault()
      const title = draft.trim()
      if (!title) return
      setTasks((prev) => [
        {
          id: crypto.randomUUID(),
          title,
          done: false,
          createdAt: Date.now(),
        },
        ...prev,
      ])
      setDraft('')
    },
    [draft]
  )

  const toggleDone = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    )
  }, [])

  const removeTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const visible = useMemo(() => {
    if (filter === 'active') return tasks.filter((t) => !t.done)
    if (filter === 'completed') return tasks.filter((t) => t.done)
    return tasks
  }, [tasks, filter])

  const counts = useMemo(() => {
    const active = tasks.filter((t) => !t.done).length
    const completed = tasks.filter((t) => t.done).length
    return { active, completed, total: tasks.length }
  }, [tasks])

  return (
    <div className="task-manager">
      <header className="task-manager__header">
        <div>
          <h1 className="task-manager__title">Team taskboard</h1>
          <p className="task-manager__subtitle">
            Sprint backlog — same app your CI pipeline builds and deploys.
          </p>
        </div>
        <div className="task-manager__stats" aria-live="polite">
          <span>{counts.active} active</span>
          <span className="task-manager__stats-dot" aria-hidden />
          <span>{counts.completed} done</span>
        </div>
      </header>

      <form className="task-form" onSubmit={addTask}>
        <label className="visually-hidden" htmlFor="task-input">
          New task
        </label>
        <input
          id="task-input"
          className="task-form__input"
          type="text"
          placeholder="Add a task (e.g. Fix flaky integration test)…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          autoComplete="off"
          maxLength={280}
        />
        <button type="submit" className="task-form__submit">
          Add
        </button>
      </form>

      <div className="task-filters" role="tablist" aria-label="Filter tasks">
        {[
          { id: 'all', label: 'All' },
          { id: 'active', label: 'Active' },
          { id: 'completed', label: 'Completed' },
        ].map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={filter === id}
            className={
              filter === id
                ? 'task-filters__btn task-filters__btn--active'
                : 'task-filters__btn'
            }
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="task-list" aria-label="Tasks">
        {visible.length === 0 ? (
          <li className="task-list__empty">
            {counts.total === 0
              ? 'No tasks yet. Add one above to populate the board.'
              : 'Nothing in this view. Try another filter.'}
          </li>
        ) : (
          visible.map((task) => (
            <li key={task.id} className="task-row">
              <label className="task-row__label">
                <input
                  className="task-row__check"
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleDone(task.id)}
                />
                <span
                  className={
                    task.done
                      ? 'task-row__title task-row__title--done'
                      : 'task-row__title'
                  }
                >
                  {task.title}
                </span>
              </label>
              <button
                type="button"
                className="task-row__delete"
                onClick={() => removeTask(task.id)}
                aria-label={`Delete: ${task.title}`}
              >
                Remove
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
